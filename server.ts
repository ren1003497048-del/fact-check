import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { checkFactsWithGemini } from './services/geminiService.ts';
import { logger } from './services/logger.ts';
import { CONFIG } from './config/constants.ts';
import type { ErrorRequestHandler } from 'express';

// Environment validation
const requiredEnvVars = ['GEMINI_API_KEY', 'TAVILY_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);

if (missingEnvVars.length > 0) {
  logger.error('Missing required environment variables', null, { missing: missingEnvVars });
  process.exit(1);
}

const app = express();

// CORS configuration - allow all origins for development
const corsOptions = {
  origin: true, // Allow all origins
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Multi-tier rate limiting - prevent abuse with multiple layers
// Tier 1: Short-term burst protection (1 minute)
const shortTermLimiter = rateLimit({
  windowMs: CONFIG.RATE_LIMIT.SHORT_TERM.WINDOW_MS,
  max: CONFIG.RATE_LIMIT.SHORT_TERM.MAX_REQUESTS,
  message: {
    error: CONFIG.RATE_LIMIT.SHORT_TERM.MESSAGE,
    tier: 'short-term',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Tier 2: Medium-term sustained protection (15 minutes)
const mediumTermLimiter = rateLimit({
  windowMs: CONFIG.RATE_LIMIT.MEDIUM_TERM.WINDOW_MS,
  max: CONFIG.RATE_LIMIT.MEDIUM_TERM.MAX_REQUESTS,
  message: {
    error: CONFIG.RATE_LIMIT.MEDIUM_TERM.MESSAGE,
    tier: 'medium-term',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Tier 3: Long-term abuse prevention (1 hour)
const longTermLimiter = rateLimit({
  windowMs: CONFIG.RATE_LIMIT.LONG_TERM.WINDOW_MS,
  max: CONFIG.RATE_LIMIT.LONG_TERM.MAX_REQUESTS,
  message: {
    error: CONFIG.RATE_LIMIT.LONG_TERM.MESSAGE,
    tier: 'long-term',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply all rate limiters to API routes (order matters: most strict first)
app.use('/api/', shortTermLimiter);
app.use('/api/', mediumTermLimiter);
app.use('/api/', longTermLimiter);

// Rate limit hit logger - monitor potential abuse
app.use('/api/', (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = function(data) {
    if (data && typeof data === 'object' && 'error' in data) {
      const errorMsg = String(data.error);
      if (errorMsg.includes('请求') || errorMsg.includes('Too many') || errorMsg.includes('Rate limit')) {
        logger.warn('Rate limit exceeded', {
          ip: req.ip,
          path: req.path,
          userAgent: req.get('user-agent'),
        });
      }
    }
    return originalJson(data);
  };
  next();
});

// Logger middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { ip: req.ip });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Fact Check API (Google Gemini + Tavily) is running' });
});

// Fact check endpoint - uses Google Gemini API with Tavily search
app.post('/api/fact-check', async (req, res) => {
  const { text, imageBase64, mimeType } = req.body;

  // Validate input
  if (!text && !imageBase64) {
    return res.status(400).json({
      error: 'Please provide text or image / 请提供文本或图片'
    });
  }

  // Text length validation using config
  if (text && text.length > CONFIG.API.MAX_TEXT_LENGTH) {
    return res.status(400).json({
      error: `Text too long. Maximum ${CONFIG.API.MAX_TEXT_LENGTH} characters / 文本过长`
    });
  }

  // Image validation using config
  if (imageBase64) {
    const normalizedMimeType = mimeType === 'image/jpg' ? 'image/jpeg' : mimeType;

    if (!CONFIG.IMAGE.VALID_MIME_TYPES.includes(normalizedMimeType as any)) {
      return res.status(400).json({
        error: `Invalid image type. Supported: ${CONFIG.IMAGE.VALID_MIME_TYPES.join(', ')} / 不支持的图片格式`
      });
    }

    // Estimate base64 size (approximately 4/3 of original)
    const estimatedSize = (imageBase64.length * 3) / 4;
    const maxSize = CONFIG.IMAGE.MAX_SIZE_MB * 1024 * 1024;
    if (estimatedSize > maxSize) {
      return res.status(400).json({
        error: `Image too large. Maximum ${CONFIG.IMAGE.MAX_SIZE_MB}MB / 图片过大`
      });
    }
  }

  try {
    const geminiKey = process.env.GEMINI_API_KEY;
    const tavilyKey = process.env.TAVILY_API_KEY;

    if (!geminiKey || !tavilyKey) {
      const missing = [];
      if (!geminiKey) missing.push('GEMINI_API_KEY');
      if (!tavilyKey) missing.push('TAVILY_API_KEY');

      return res.status(500).json({
        error: `Server configuration error: Missing ${missing.join(', ')}. Please check your .env file.`
      });
    }

    // Call Google Gemini API with Tavily search
    const result = await checkFactsWithGemini(geminiKey, tavilyKey, text, imageBase64, mimeType);

    logger.info('Fact check completed successfully');
    res.json(result);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Fact check failed', error);

    // Provide user-friendly error messages
    let userError = 'Fact check failed / 核查失败，请重试';
    if (errorMessage.includes('parsing failed') || errorMessage.includes('Invalid JSON')) {
      userError = 'AI response format error. Please try again. / AI返回格式错误，请重试';
    } else if (errorMessage.includes('400') || errorMessage.includes('Invalid request')) {
      userError = 'Invalid request. Please try again. / 请求无效，请重试';
    } else if (errorMessage.includes('timeout') || errorMessage.includes('aborted')) {
      userError = 'Request timeout. Please try again. / 请求超时，请重试';
    }

    res.status(500).json({
      error: userError
    });
  }
});

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error('Server error', err, { path: req.path, method: req.method });
  res.status(500).json({
    error: 'Internal server error / 服务器内部错误'
  });
};
app.use(errorHandler);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  logger.info(`Fact Check API Server (Google Gemini + Tavily) running on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/api/health`);
});

// Trigger nodemon restart

