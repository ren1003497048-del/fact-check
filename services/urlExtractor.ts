/**
 * URL Content Extractor Service
 * 使用多个 API 提取网页内容
 */

import { logger } from './logger.ts';

export interface ExtractedContent {
  title: string;
  content: string;
  url: string;
  success: boolean;
}

// 常量定义
const MAX_URL_LENGTH = 2048;
const MAX_CONTENT_LENGTH = 5000;
const MIN_CONTENT_LENGTH = 100;
const MAX_TITLE_LENGTH = 50;

// 预编译正则表达式以提高性能
const URL_PATTERN = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

/**
 * 检测是否为 URL
 */
export function isUrl(text: string): boolean {
  return URL_PATTERN.test(text.trim());
}

/**
 * 从 URL 提取内容（使用多个方法）
 */
export async function extractUrlContent(url: string): Promise<ExtractedContent> {
  // 输入验证
  if (!url || typeof url !== 'string') {
    throw new Error('Invalid URL: URL must be a non-empty string / URL 必须是非空字符串');
  }

  const trimmedUrl = url.trim();
  if (trimmedUrl.length === 0) {
    throw new Error('Invalid URL: URL cannot be empty / URL 不能为空');
  }

  if (trimmedUrl.length > MAX_URL_LENGTH) {
    throw new Error(`Invalid URL: URL too long (max ${MAX_URL_LENGTH} characters) / URL 过长（最大 ${MAX_URL_LENGTH} 字符）`);
  }

  logger.info('Extracting content from URL', { url: trimmedUrl });

  // 方法1: 尝试使用浏览器兼容的提取 API
  try {
    // 添加超时控制（10秒）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    // 使用 urlwatch API 或类似的公共 API
    // 这里我们使用一个简单的直接获取方法
    const response = await fetch(trimmedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('CORS/Access forbidden - 无法访问该网站 (CORS/Access forbidden - Unable to access this website)');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    // 简单的 HTML 解析提取标题和内容
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'Unknown Title';

    // 提取主要文本内容（移除 script 和 style）
    const content = html
      .replace(/<script[^>]*>.*?<\/script>/gis, '')
      .replace(/<style[^>]*>.*?<\/style>/gis, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, MAX_CONTENT_LENGTH); // 限制长度

    if (!content || content.length < MIN_CONTENT_LENGTH) {
      throw new Error('Extracted content too short');
    }

    logger.info('Content extracted successfully', { title, contentLength: content.length });

    return {
      title,
      content,
      url: trimmedUrl,
      success: true
    };

  } catch (error) {
    logger.warn('Direct extraction failed', error);

    // 处理超时错误
    if (error instanceof Error && error.name === 'AbortError') {
      logger.warn('URL extraction timeout', { url: trimmedUrl });
      // 继续到回退方法
    } else {
      logger.warn('Direct extraction failed', error);
    }

    // 方法2: 如果是中文网站，使用特定的提取策略
    try {
      // 对于豆瓣等中文网站，尝试从 URL 中提取关键信息
      const urlInfo = extractInfoFromUrl(trimmedUrl);

      return {
        title: urlInfo.title,
        content: `用户提供的网页链接：${trimmedUrl}\n\n网站类型：${urlInfo.site}\n主题：${urlInfo.topic}\n\n请对该链接内容进行事实核查。`,
        url: trimmedUrl,
        success: true
      };
    } catch (fallbackError) {
      logger.error('All extraction methods failed', fallbackError);

      return {
        title: '无法提取内容',
        content: `用户提供了一个网页链接：${trimmedUrl}\n\n系统无法直接访问该链接内容，但 AI 可以尝试基于链接中的信息进行分析。`,
        url: trimmedUrl,
        success: false
      };
    }
  }
}

/**
 * 从 URL 中提取基本信息
 */
function extractInfoFromUrl(url: string): { title: string; site: string; topic: string } {
  try {
    const urlObj = new URL(url);

    // 识别网站
    let site = '未知网站';
    if (urlObj.hostname.includes('douban.com')) {
      site = '豆瓣';
    } else if (urlObj.hostname.includes('weibo.com')) {
      site = '微博';
    } else if (urlObj.hostname.includes('zhihu.com')) {
      site = '知乎';
    } else if (urlObj.hostname.includes('weixin.qq.com')) {
      site = '微信公众号';
    } else if (urlObj.hostname.includes('toutiao.com')) {
      site = '今日头条';
    }

    // 从 URL 路径提取主题
    const pathParts = urlObj.pathname.split('/').filter(p => p);
    const topic = pathParts[pathParts.length - 1] || '未知主题';

    // 尝试解码主题
    let decodedTopic = topic;
    try {
      decodedTopic = decodeURIComponent(topic);
    } catch {
      // 使用原始主题
    }

    return {
      title: `${site} - ${decodedTopic.substring(0, MAX_TITLE_LENGTH)}`,
      site,
      topic: decodedTopic
    };
  } catch {
    return {
      title: '网页链接',
      site: '未知网站',
      topic: url
    };
  }
}

/**
 * 为 AI 准备 URL 内容提示
 */
export function prepareUrlPrompt(extracted: ExtractedContent, originalText: string): string {
  if (extracted.success) {
    return `用户提供了一个网页链接，系统已提取内容：

标题：${extracted.title}
链接：${extracted.url}

提取的内容摘要：
${extracted.content.substring(0, 2000)}...

${extracted.content.length > 2000 ? '(内容已截断，完整内容请基于标题和链接进行分析)' : ''}

请对该网页链接的内容进行事实核查。`;
  } else {
    return `用户提供了一个网页链接：${extracted.url}

系统无法直接访问该链接内容。请基于以下信息进行分析：
${extracted.content}

如果可能，请在分析中说明该链接的可信度和需要验证的关键点。`;
  }
}
