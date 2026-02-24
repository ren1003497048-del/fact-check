import { VerificationResult } from '../types';
import { logger } from './logger';
import { CONFIG } from '../config/constants';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003';

// Retry delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch with timeout
const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout / 1000}s`);
    }
    throw error;
  }
};

export const checkFacts = async (
  text: string,
  imageBase64?: string,
  mimeType?: string
): Promise<VerificationResult> => {
  const MAX_RETRIES = CONFIG.API_CLIENT.MAX_RETRIES;
  const TIMEOUT = CONFIG.API.TIMEOUT_MS;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      const response = await fetchWithTimeout(
        `${API_URL}/api/fact-check`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text, imageBase64, mimeType }),
        },
        TIMEOUT
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result: VerificationResult = await response.json();
      return result;

    } catch (error) {
      attempt++;
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.warn(`API Call Attempt ${attempt} failed: ${errorMessage}`);

      // Determine if error is retryable
      const isInternalError = errorMessage.includes('500') || errorMessage.includes('Internal Server Error');
      const isOverloaded = errorMessage.includes('503') || errorMessage.includes('Service Unavailable');
      const isTimeout = errorMessage.includes('timeout');
      const isNetworkError = errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError');

      const isRetryable = (isInternalError || isOverloaded || isTimeout || isNetworkError) && attempt < MAX_RETRIES;

      if (isRetryable) {
        // Exponential backoff: 1s, 2s, 4s
        const backoffDelay = 1000 * Math.pow(2, attempt - 1);
        logger.info(`Retrying in ${backoffDelay / 1000}s...`);
        await delay(backoffDelay);
        continue;
      }

      if (attempt === MAX_RETRIES) {
        console.error('API Call failed after max retries:', errorMessage);
        // Provide more user-friendly error messages
        if (isTimeout) {
          throw new Error('Request timeout. The server took too long to respond. Please try again. / 请求超时，服务器响应时间过长，请重试。');
        }
        if (isNetworkError) {
          throw new Error('Network error. Please check your connection. / 网络错误，请检查网络连接。');
        }
        throw error;
      }

      throw error;
    }
  }

  throw new Error('Unknown error occurred');
};
