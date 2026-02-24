/**
 * Application configuration constants
 * Centralized configuration for better maintainability
 */

export const CONFIG = {
  // Image processing
  IMAGE: {
    MAX_WIDTH: 800,          // Maximum width for image resizing
    JPEG_QUALITY: 0.7,       // JPEG compression quality (0-1)
    MAX_SIZE_MB: 5,          // Maximum image size in MB
    VALID_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'] as const,
  },

  // API configuration
  API: {
    MAX_RETRIES: 3,                   // Maximum retry attempts for API calls
    TIMEOUT_MS: 60000,                // API request timeout (60 seconds)
    MAX_TEXT_LENGTH: 4000,            // Maximum text length (~4000 Chinese chars ≈ 6500 tokens)
    RECOMMENDED_LENGTH: 2000,         // Recommended length for best performance
  },

  // History & storage
  HISTORY: {
    MAX_ENTRIES: 50,         // Maximum history entries to keep
    TRIM_ON_QUOTA: 10,       // Trim to this many entries when quota exceeded
    STORAGE_KEY: 'truth-hunter-history',
  },

  // Rate limiting - Multi-tier protection
  RATE_LIMIT: {
    // Tier 1: Short-term (burst protection)
    SHORT_TERM: {
      WINDOW_MS: 60 * 1000,           // 1 minute
      MAX_REQUESTS: 5,                 // Max 5 requests per minute
      MESSAGE: '请求过于频繁，请稍后再试。/ Too many requests. Please wait a moment.',
    },

    // Tier 2: Medium-term (sustained high-frequency protection)
    MEDIUM_TERM: {
      WINDOW_MS: 15 * 60 * 1000,      // 15 minutes
      MAX_REQUESTS: 15,                // Max 15 requests per 15 minutes
      MESSAGE: '短时间内请求过多，请15分钟后再试。/ Too many requests. Please try again in 15 minutes.',
    },

    // Tier 3: Long-term (abuse prevention)
    LONG_TERM: {
      WINDOW_MS: 60 * 60 * 1000,      // 1 hour
      MAX_REQUESTS: 50,                // Max 50 requests per hour
      MESSAGE: '请求次数超过限额，请1小时后再试。/ Rate limit exceeded. Please try again in 1 hour.',
    },
  },

  // Retry configuration
  RETRY: {
    BASE_DELAY_MS: 1000,     // Base delay for exponential backoff
  },

  // Quote display configuration
  QUOTE: {
    ROTATION_INTERVAL_MS: 10000,  // Auto-rotate quotes every 10 seconds
    MIN_DISPLAY_TIME_MS: 5000,    // Minimum 5 seconds display time
  },

  // API retry configuration (client-side)
  API_CLIENT: {
    MAX_RETRIES: 3,          // Maximum retry attempts for API calls
  },
} as const;

// Type exports for use in components
export type ValidMimeType = typeof CONFIG.IMAGE.VALID_MIME_TYPES[number];
