/**
 * InputSection Component
 * Main input area with text area and image upload
 */

import React from 'react';
import * as Icons from './Icons';
import { CONFIG } from '../config/constants';

interface InputSectionProps {
  inputText: string;
  setInputText: (text: string) => void;
  imagePreview: string | null;
  selectedImageName: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onSubmit: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onRemoveImage: () => void;
  onClearImageError: () => void;
  onScreenshot: () => void;
  onShare: () => void;
  onToggleHistory: () => void;
  loading: boolean;
  hasResult: boolean;
  historyCount: number;
  error: string | null;
  imageError: string | null;
}

/**
 * Component displaying the main input section
 */
export const InputSection: React.FC<InputSectionProps> = ({
  inputText,
  setInputText,
  imagePreview,
  selectedImageName,
  fileInputRef,
  onSubmit,
  onImageUpload,
  onRemoveImage,
  onClearImageError,
  onScreenshot,
  onShare,
  onToggleHistory,
  loading,
  hasResult,
  historyCount,
  error,
  imageError
}) => {
  const maxLength = CONFIG.API.MAX_TEXT_LENGTH;
  const recommendedLength = CONFIG.API.RECOMMENDED_LENGTH;
  const charCount = inputText.length;
  const isNearRecommended = charCount > recommendedLength * 0.8 && charCount < recommendedLength;
  const isOverRecommended = charCount >= recommendedLength && charCount < maxLength * 0.9;
  const isNearLimit = charCount >= maxLength * 0.9 && charCount < maxLength;
  const isAtLimit = charCount >= maxLength;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= maxLength) {
      setInputText(newText);
    }
  };
  return (
    <section className="mb-12">
      <div className="border-heavy p-1 transition-all focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2">

        {/* Image Preview Area */}
        {imagePreview && (
          <div className="relative bg-gray-100 border-b-2 border-black p-4">
            {imageError && (
              <div className="mb-3 p-3 border-2 border-red-600 bg-red-50 text-red-800 text-xs flex items-center gap-2">
                <Icons.AlertIcon />
                <span>{imageError}</span>
                <button
                  onClick={onClearImageError}
                  className="ml-auto text-red-600 hover:underline font-bold"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={imagePreview} alt="Preview" className="h-20 w-auto object-cover border border-black shadow-sm" />
                <span className="text-xs font-mono truncate max-w-[200px]">{selectedImageName || 'capture.jpg'}</span>
              </div>
              <button
                onClick={onRemoveImage}
                className="text-xs uppercase font-bold hover:underline text-red-600"
              >
                REMOVE [X]
              </button>
            </div>
          </div>
        )}

        <textarea
          value={inputText}
          onChange={handleTextChange}
          rows={6}
          className="w-full p-4 focus:outline-none text-lg resize-none placeholder:text-gray-400 font-serif-sc"
          placeholder="在此输入新闻文本、粘贴链接或上传截图以开始核查...&#10;Paste news text, a social media link, or upload a screenshot to investigate..."
          maxLength={maxLength}
        ></textarea>

        {/* Character Counter */}
        <div className="px-4 py-2 border-t border-gray-200 flex justify-between items-center text-xs">
          <div className="flex items-center gap-3">
            {charCount > 0 && (
              <span className="text-gray-500">
                {charCount.toLocaleString()} / {maxLength.toLocaleString()} 字符
              </span>
            )}
            {/* Performance hint */}
            {isNearRecommended && !isOverRecommended && (
              <span className="text-blue-600">
                💡 推荐长度：{recommendedLength.toLocaleString()} 字符（最佳性能）
              </span>
            )}
            {isOverRecommended && !isNearLimit && (
              <span className="text-orange-600">
                ⚠️ 超过推荐长度，处理时间可能增加
              </span>
            )}
            {isNearLimit && (
              <span className={`font-bold ${isAtLimit ? 'text-red-600' : 'text-orange-600'}`}>
                {isAtLimit ? '🚫 已达最大长度' : '⚠️ 接近限制'}
              </span>
            )}
          </div>
        </div>

        <div className="flex border-t-2 border-black">
          <button
            onClick={onSubmit}
            disabled={loading}
            className="flex-1 bg-black text-white py-4 font-bold hover:bg-gray-800 transition uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? '正在连接信源... / CONNECTING TO SOURCES...' : '开始核查 / START INVESTIGATION'}
            {!loading && <Icons.SearchIcon />}
          </button>

          <div className="relative">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={onImageUpload}
            />
            <button className="h-full px-9 border-l-2 border-black hover:bg-gray-100 flex items-center justify-center gap-2 transition" title="上传图片 / Upload Image">
              <Icons.UploadIcon />
              <span className="text-sm font-bold uppercase">上传</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-3 justify-end">
        <button
          onClick={onScreenshot}
          disabled={!hasResult}
          className="px-4 py-2 border-2 border-black text-xs font-bold uppercase hover:bg-black hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          title="截图 / Screenshot"
        >
          <Icons.ScreenshotIcon />
          <span className="hidden sm:inline">截图 / Screenshot</span>
        </button>
        <button
          onClick={onShare}
          disabled={!hasResult}
          className="px-4 py-2 border-2 border-black text-xs font-bold uppercase hover:bg-black hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          title="分享 / Share"
        >
          <Icons.ShareIcon />
          <span className="hidden sm:inline">分享 / Share</span>
        </button>
        <button
          onClick={onToggleHistory}
          className="px-4 py-2 border-2 border-black text-xs font-bold uppercase hover:bg-black hover:text-white transition flex items-center gap-2 relative"
          title="历史记录 / History"
        >
          <Icons.HistoryIcon />
          <span className="hidden sm:inline">历史 / History</span>
          {historyCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {historyCount}
            </span>
          )}
        </button>
      </div>

      <p className="text-xs mt-3 text-gray-500 font-mono italic text-right">
        * 智能搜索与图片分析 / Smart Search & Image Analysis
      </p>

      {error && (
        <div className="mt-4 p-4 border-2 border-red-600 bg-red-50 text-red-800 flex items-center gap-3">
          <Icons.AlertIcon />
          <span className="text-sm font-bold">{error}</span>
        </div>
      )}
    </section>
  );
};
