/**
 * Gemini API Service with Tavily Search Integration
 * 使用原生 fetch 调用 Google Gemini REST API，支持代理
 */

import type { VerificationResult } from "../types.ts";
import { searchWithTavily, formatSearchResultsForLLM } from './tavilyService.ts';
import { logger } from './logger.ts';
import { isUrl, extractUrlContent, prepareUrlPrompt } from './urlExtractor.ts';

const BASE_SYSTEM_INSTRUCTION = `
Role: You are "Fact Check" (事实核查), a mercilessly rigorous Fact-Checking Editor-in-Chief with access to real-time search results.

**CRITICAL LANGUAGE REQUIREMENT**:
- You MUST output ALL content values in the SAME LANGUAGE as the user's input
- If the user writes in Chinese (中文), output MUST be in Simplified Chinese (简体中文)
- If the user writes in English, output MUST be in English
- This applies to ALL JSON string values: analysis, expert_advice, timeline events, references notes, etc.

**STRICT OUTPUT FORMAT**:
You must return a **SINGLE VALID JSON OBJECT**.
Do NOT return Markdown code blocks (e.g., \`\`\`json).
Do NOT return any text outside the JSON object.

**JSON SCHEMA**:
{
  "verdict": "REAL" | "FAKE" | "MISLEADING" | "UNVERIFIED",
  "score": number (MUST be an integer between 0-100, represents confidence percentage),
  "analysis": {
    "source": "string (Analyze source authority)",
    "context": "string (Context & consistency check)",
    "logic": {
        "summary": "string (Logical consistency summary)",
        "amplification_nodes": ["string", "string"],
        "primary_opinion_field": "string",
        "opinion_stratification": "string (Layered analysis)"
    },
    "cross_check": "string (Cross-verification details)",
    "visual": "string"
  },
  "timeline": [
    { "time": "YYYY-MM-DD", "event": "string" }
  ],
  "expert_advice": "string (Editor's note)",
  "references": [
    {
      "source_name": "string",
      "url": "string",
      "note": "string",
      "type": "SUPPORT" | "CONFLICT" | "NEUTRAL"
    }
  ]
}

**Core Philosophy**:
*   **The "REAL" Threshold**: A verdict of "REAL" is ONLY allowed if **EVERY** element (100%) matches Tier 1 authoritative sources perfectly.
*   **The "Uncertainty" Rule**: If even ONE minor detail is unverified or exaggerated, the verdict CANNOT be "REAL". Use "MISLEADING" or "UNVERIFIED".

**Investigation Rules**:
1.  **Source Stratification**: Tier 1 (Reuters, Xinhua, AP News, etc.) > Tier 2 (Local) > Tier 3 (Social Media - Reject as proof).
2.  **Use Search Results**: I will provide REAL search results below. USE THEM to verify claims. DO NOT rely on your training data alone.
3.  **Logic**: Identify amplification nodes (who made it viral?) and separate fact from emotion.
4.  **Absolute Claim Trap**: If the text says "All", "Global Only", "Total Ban" -> Search for exceptions. If one exists -> MISLEADING.

**IMPORTANT**:
- PRIORITIZE the provided search results over your training data
- If you mention URLs, include them in the 'references' list (USE URLs from search results)
- Do not invent URLs for claims you cannot verify
- Mark sources as "SUPPORT" if they confirm the claim, "CONFLICT" if they contradict, "NEUTRAL" if unrelated
- **LANGUAGE CONSISTENCY IS CRITICAL**: Match the user's input language exactly
`;

// Helper for waiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Detect if the result needs translation to Chinese
 * Checks if the content is primarily English when it should be Chinese
 */
function detectNeedsTranslation(result: VerificationResult): boolean {
  const content = JSON.stringify(result);

  // Count Chinese characters
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;

  // Count total characters (excluding spaces, JSON keys, and common punctuation)
  const totalContentChars = content.replace(/["\{\}\[\]:,.\d\s]/g, '').length;

  // If less than 30% of content is Chinese, it needs translation
  const chineseRatio = totalContentChars > 0 ? chineseChars / totalContentChars : 0;

  logger.debug('Language detection', {
    chineseChars,
    totalContentChars,
    chineseRatio: chineseRatio.toFixed(2),
    needsTranslation: chineseRatio < 0.3
  });

  return chineseRatio < 0.3;
}

/**
 * Translate VerificationResult to Chinese using Gemini
 */
async function translateResultToChinese(
  result: VerificationResult,
  apiKey: string
): Promise<VerificationResult> {
  try {
    const prompt = `
Translate the following fact-checking result to Simplified Chinese (简体中文).
Keep ALL JSON keys in English (e.g., "verdict", "score", "analysis").
ONLY translate the string values to Chinese.

Input JSON:
${JSON.stringify(result, null, 2)}

CRITICAL REQUIREMENTS:
- Return ONLY a valid JSON object
- Do NOT include markdown code blocks
- Do NOT add any text outside the JSON
- Ensure all string values (analysis, expert_advice, timeline events, references) are translated to natural Simplified Chinese
`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 8192
      }
    };

    // Get proxy dispatcher
    const dispatcher = await getProxyDispatcher();
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    };

    if (dispatcher) {
      (fetchOptions as any).dispatcher = dispatcher;
    }

    const response = await fetch(apiUrl, fetchOptions);

    if (!response.ok) {
      throw new Error(`Translation API Error: ${response.status}`);
    }

    const data = await response.json();
    let translatedText = data.candidates[0].content.parts[0].text;

    // Cleanup markdown code blocks
    const match = translatedText.match(/```json\s*([\s\S]*?)\s*```/) || translatedText.match(/```\s*([\s\S]*?)\s*```/);
    if (match) {
      translatedText = match[1];
    }
    translatedText = translatedText.trim();

    const translatedResult = JSON.parse(translatedText);
    return translatedResult;

  } catch (error) {
    logger.error('Translation failed, returning original result', error);
    return result; // Return original if translation fails
  }
}

// Proxy dispatcher cache (using undici Dispatcher type)
let proxyDispatcher: globalThis.Dispatcher | undefined = undefined;

// Initialize proxy support
async function getProxyDispatcher() {
  const PROXY_URL = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.https_proxy || process.env.http_proxy || '';

  if (!PROXY_URL) {
    return undefined;
  }

  if (proxyDispatcher) {
    return proxyDispatcher;
  }

  if (PROXY_URL && !proxyDispatcher) {
    logger.warn('Proxy URL configured but dispatcher creation failed');
  }

  try {
    // Import undici dynamically for Node.js 18+
    const undiciModule = globalThis.undici || (await import('undici'));
    const { ProxyAgent } = undiciModule;
    proxyDispatcher = new ProxyAgent(PROXY_URL);
    logger.info('Proxy dispatcher created', { proxy: PROXY_URL.replace(/\/\/.*:.*@/, '//***:***@') });
    return proxyDispatcher;
  } catch (error) {
    logger.warn('Failed to create proxy dispatcher', error);
    return undefined;
  }
}

export async function checkFactsWithGemini(
  geminiApiKey: string,
  tavilyApiKey: string,
  text?: string,
  imageBase64?: string,
  mimeType?: string
): Promise<VerificationResult> {
  // URL detection and content extraction
  let processedText = text || '';
  const isUrlInput = text && isUrl(text);

  if (isUrlInput) {
    logger.info('URL detected in input, extracting content', { url: text.trim() });
    try {
      const extracted = await extractUrlContent(text.trim());
      processedText = prepareUrlPrompt(extracted, text);
      logger.info('URL content extracted successfully', {
        title: extracted.title,
        success: extracted.success
      });
    } catch (error) {
      logger.warn('URL extraction failed, using URL as search query', error);
      // Fallback: use URL as search query
      processedText = `请核查以下网页内容的真实性：${text}`;
    }
  }

  // Language detection - check both text and default to Chinese for image-only uploads
  const hasChineseChar = /[\u4e00-\u9fa5]/.test(processedText || '');
  // If only image is uploaded (no text), default to Chinese since the app interface is Chinese
  const isImageOnly = !processedText || processedText.trim() === '';
  const useChinese = hasChineseChar || (isImageOnly && imageBase64);

  // Language rule
  const languageRule = useChinese
    ? `
*** 检测到中文输入 - CHINESE INPUT DETECTED ***

**MANDATORY LANGUAGE REQUIREMENT**:
- User input is in CHINESE (中文)
- ALL JSON string values MUST be in SIMPLIFIED CHINESE (简体中文)
- This includes: analysis.source, analysis.context, analysis.logic.summary, analysis.cross_check, analysis.visual, expert_advice, timeline[].event, references[].note
- ONLY JSON keys remain in English (e.g., "verdict", "score", "analysis")

示例 / Example:
{
  "verdict": "UNVERIFIED",
  "score": 50,
  "analysis": {
    "source": "该信息来源于个人社交媒体账号，非权威媒体",
    "context": "缺乏官方机构或主流媒体的证实",
    "logic": {
      "summary": "该说法缺乏可靠证据支持"
    }
  },
  "expert_advice": "建议等待官方确认",
  "timeline": [
    {"time": "2024-01-01", "event": "相关信息开始在网络传播"}
  ]
}

**CRITICAL**: 所有分析内容必须使用简体中文，不得使用英文！
`
    : `
**CRITICAL LANGUAGE RULE**:
- User input is in ENGLISH
- ALL JSON string values MUST be in ENGLISH
- ONLY JSON keys remain in English (e.g., "verdict", "score", "analysis")
- If input is in another language, match that language
`;

  const effectiveSystemInstruction = BASE_SYSTEM_INSTRUCTION + "\n" + languageRule;

  // Get proxy dispatcher
  const dispatcher = await getProxyDispatcher();
  const PROXY_URL = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.https_proxy || process.env.http_proxy || '';
  if (PROXY_URL && !dispatcher) {
    logger.warn('Proxy URL configured but dispatcher creation failed');
  }

  // Retry configuration
  const MAX_RETRIES = 3;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      // Step 1: Perform web search using Tavily
      let searchResultsText = '';
      if (processedText && processedText.trim()) {
        try {
          logger.debug('Searching web for fact-checking');
          // For URLs, search with the extracted content or URL info
          const searchQuery = isUrlInput && processedText.length > 500
            ? processedText.substring(0, 200) // Use first part of extracted content
            : processedText;

          const searchResults = await searchWithTavily(tavilyApiKey, searchQuery, 10);
          searchResultsText = formatSearchResultsForLLM(searchResults);
          logger.info('Tavily search completed', { resultsCount: searchResults.results.length });
        } catch (error) {
          logger.warn('Tavily search failed, proceeding without search results', error);
          searchResultsText = '搜索失败，将进行一般性分析。/ Search failed. Proceed with general analysis.';
        }
      }

      // Step 2: Build prompt with search results
      let promptText = "USER INPUT:\n" + (processedText || (useChinese ? "请分析这张图片的内容（图片包含中文内容）/ Please analyze this Chinese image content." : "Analyze this image content."));

      if (searchResultsText) {
        promptText += `\n\n=== REAL-TIME SEARCH RESULTS ===\n${searchResultsText}\n=== END OF SEARCH RESULTS ===\n\nIMPORTANT: Use the above search results to verify the claim. Prioritize these real-time sources.`;
      }

      // Add a final nudge in the prompt text as well
      if (useChinese) {
        promptText += "\n\n*** 最后提醒：请务必使用简体中文返回所有分析内容！Final Reminder: ALL analysis content MUST be in Simplified Chinese! ***\n";
        promptText += "包括：source, context, cross_check, visual, expert_advice, timeline[].event 等所有字符串字段。\n";
        promptText += "Include: ALL string fields like source, context, cross_check, visual, expert_advice, timeline[].event must be in Chinese.\n";
      } else {
        promptText += "\n\nReminder: Output ALL content in the same language as the user input.\n";
      }

      // Step 3: Prepare content parts
      const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
      parts.push({ text: promptText });

      if (imageBase64 && mimeType) {
        // Normalize mimeType: sometimes it comes as image/jpg, but API prefers image/jpeg
        const finalMimeType = mimeType === 'image/jpg' ? 'image/jpeg' : mimeType;
        parts.push({
          inlineData: {
            mimeType: finalMimeType,
            data: imageBase64
          }
        });
      }

      // Step 4: Call Gemini API using REST API with native fetch
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

      const requestBody = {
        contents: [{ parts }],
        systemInstruction: {
          parts: [{ text: effectiveSystemInstruction }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192
        }
      };

      logger.debug('Calling Gemini API', { withProxy: !!dispatcher });

      let response;
      try {
        // Increase timeout and use duplex option for Node.js fetch compatibility
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

        const fetchOptions: RequestInit = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
          duplex: 'half'
        };

        // Add dispatcher if using proxy
        if (dispatcher) {
          fetchOptions.dispatcher = dispatcher;
        }

        response = await fetch(apiUrl, fetchOptions);
        clearTimeout(timeoutId);
      } catch (fetchError: unknown) {
        const err = fetchError as Error & { cause?: Error };
        logger.error('Gemini API fetch error', err);
        throw fetchError;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No response candidates returned from Gemini API");
      }

      let responseText = data.candidates[0].content.parts[0].text;

      if (!responseText) {
        throw new Error("No response text generated");
      }

      // Cleanup Markdown code blocks if present
      const match = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/```\s*([\s\S]*?)\s*```/);
      if (match) {
        responseText = match[1];
      }
      responseText = responseText.trim();

      // Safe JSON parsing with error handling
      let result: VerificationResult;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        logger.error('Failed to parse JSON response', parseError, { preview: responseText.substring(0, 200) });
        throw new Error('AI response parsing failed. Invalid JSON format / AI返回格式错误，请重试');
      }

      // Validate result structure
      if (!result.verdict || !result.analysis || !result.timeline) {
        logger.error('Invalid response structure', null, { preview: JSON.stringify(result, null, 2).substring(0, 200) });
        throw new Error('AI response missing required fields / AI返回缺少必要字段');
      }

      // Validate and normalize score to 0-100 range
      if (result.score < 0 || result.score > 100) {
        // If score is outside 0-100, check if it's in 0-1 range
        if (result.score >= 0 && result.score <= 1) {
          result.score = Math.round(result.score * 100);
          logger.debug('Score normalized from 0-1 to 0-100', { score: result.score });
        } else {
          // Clamp to valid range
          result.score = Math.max(0, Math.min(100, result.score));
          logger.warn('Score clamped to valid range', { score: result.score });
        }
      } else {
        // Ensure score is an integer
        result.score = Math.round(result.score);
      }

      // Language validation and translation (if needed)
      if (useChinese) {
        const needsTranslation = detectNeedsTranslation(result);
        if (needsTranslation) {
          logger.warn('AI returned English instead of Chinese, translating...', {
            hasChineseText: /[\u4e00-\u9fa5]/.test(JSON.stringify(result))
          });
          result = await translateResultToChinese(result, geminiApiKey);
          logger.info('Translation completed');
        }
      }

      logger.info('Fact check completed successfully');
      return result;

    } catch (error) {
      attempt++;
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.warn(`Fact Check Attempt ${attempt} failed`, { error: errorMessage, attempt });

      const isInternalError = errorMessage.includes("500") || errorMessage.includes("Internal Server Error");
      const isOverloaded = errorMessage.includes("503");
      const isJSONError = error instanceof SyntaxError;

      if ((isInternalError || isOverloaded || isJSONError) && attempt < MAX_RETRIES) {
        // Exponential backoff: 1s, 2s, 4s
        await delay(1000 * Math.pow(2, attempt - 1));
        continue;
      }

      if (attempt === MAX_RETRIES) {
        logger.error("Fact Check failed after max retries", error, { attempts: attempt });
        throw error;
      }
      // If it's a different error (e.g., 400 Bad Request), throw immediately
      throw error;
    }
  }

  throw new Error("Unknown error occurred");
}
