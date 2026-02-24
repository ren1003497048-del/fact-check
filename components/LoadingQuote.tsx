/**
 * LoadingQuote Component
 * Displays intelligent loading screen with rotating quotes during fact-checking
 */

import React from 'react';
import { QuoteItem } from '../constants/quotes';

interface LoadingQuoteProps {
  quote: QuoteItem;
}

/**
 * Component that displays a quote with context during loading
 */
export const LoadingQuote: React.FC<LoadingQuoteProps> = ({ quote }) => {
  return (
    <div className="mt-8 border-2 border-black bg-white shadow-lg overflow-hidden animate-fade-in">
      {/* Decorative header bar */}
      <div className="bg-black text-white px-6 py-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest">正在核查中 / Investigation in Progress</span>
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
        </div>
      </div>

      {/* Quote content */}
      <div className="p-8 md:p-12 bg-gradient-to-br from-gray-50 to-white">
        {/* Era badge */}
        <div className="inline-block mb-6">
          <span className="text-xs font-bold uppercase tracking-wider border-2 border-black px-3 py-1 bg-white">
            {quote.era}
          </span>
        </div>

        {/* Main quote */}
        <blockquote className="mb-8">
          <p className="text-2xl md:text-3xl lg:text-4xl font-serif-sc font-bold leading-relaxed text-gray-900 mb-6">
            {quote.quote}
          </p>
        </blockquote>

        {/* Context */}
        <div className="border-l-4 border-black pl-6 py-2 bg-gray-100">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed whitespace-pre-line">
            {quote.context}
          </p>
        </div>

        {/* Loading indicator */}
        <div className="mt-8 flex items-center justify-center gap-3 text-gray-400 text-sm">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <span className="tracking-wider font-medium">
            正在分析信源并交叉验证数据... / Analyzing sources & cross-referencing data
          </span>
        </div>
      </div>

      {/* Progress steps */}
      <div className="mt-6 grid grid-cols-4 gap-2 text-xs">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-black text-white flex items-center justify-center font-bold">1</div>
          <span className="text-gray-600">文本识别 / OCR</span>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-black text-white flex items-center justify-center font-bold">2</div>
          <span className="text-gray-600">全网搜索 / Search</span>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-black text-white flex items-center justify-center font-bold">3</div>
          <span className="text-gray-600">深度分析 / Analysis</span>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold">4</div>
          <span className="text-gray-600">交叉验证 / Verify</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-200">
        <div className="h-full bg-black animate-progress"></div>
      </div>
    </div>
  );
};
