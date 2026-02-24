/**
 * Tavily Search API Service
 * 专为 AI 设计的搜索 API，返回结构化结果
 */

import { logger } from './logger.ts';

export interface SearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
}

export interface TavilyResponse {
  answer: string;
  query: string;
  results: SearchResult[];
}

/**
 * 使用 Tavily API 进行网络搜索
 * @param apiKey Tavily API Key
 * @param query 搜索查询
 * @param maxResults 最大结果数（默认 10）
 */
export async function searchWithTavily(
  apiKey: string,
  query: string,
  maxResults: number = 10
): Promise<TavilyResponse> {
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        search_depth: 'basic', // 'basic' 或 'advanced'
        max_results: maxResults,
        include_domains: [], // 可选：限制搜索域名
        exclude_domains: [], // 可选：排除域名
        include_answer: true,
        include_raw_content: false,
        include_images: false,
        include_image_descriptions: false,
        // 优化搜索结果为 AI 友好格式
        topic: 'general', // 'general' 或 'news'
        days: 3, // 如果是 news，限制天数
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Tavily API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    logger.info(`Tavily search completed for query: "${query}"`, { resultsCount: data.results?.length || 0 });

    return data as TavilyResponse;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Tavily search failed', error);
    throw error;
  }
}

/**
 * 格式化搜索结果为文本，供 LLM 使用
 */
export function formatSearchResultsForLLM(tavilyResponse: TavilyResponse): string {
  if (!tavilyResponse.results || tavilyResponse.results.length === 0) {
    return 'No search results found.';
  }

  const formatted = tavilyResponse.results.map((result, index) => {
    return `
[Source ${index + 1}]
Title: ${result.title}
URL: ${result.url}
Summary: ${result.content}
${result.published_date ? `Published: ${result.published_date}` : ''}
`;
  }).join('\n---\n');

  return formatted;
}
