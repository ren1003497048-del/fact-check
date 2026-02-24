import React, { useState, useRef, useEffect } from 'react';
import { checkFacts } from './services/apiClient';
import { VerificationResult } from './types';
import { CONFIG } from './config/constants';

// Components
import { InputSection } from './components/InputSection';
import { LoadingQuote } from './components/LoadingQuote';
import { ResultSection } from './components/ResultSection';
import { HistoryPanel } from './components/HistoryPanel';
import * as Icons from './components/Icons';

// Hooks
import { useImageUpload } from './hooks/useImageUpload';
import { useHistory } from './hooks/useHistory';
import { useQuoteRotation } from './hooks/useQuoteRotation';

// Utils
import { parseBase64DataUrl } from './utils/imageUtils';
import { logger } from './services/logger';

const App: React.FC = () => {
  // Core state
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState('');

  // Custom hooks
  const {
    selectedImage,
    imagePreview,
    fileInputRef,
    handleImageUpload,
    handleRemoveImage,
    clearError: clearImageError,
    error: imageError
  } = useImageUpload();

  const {
    history,
    showHistory,
    addToHistory,
    clearHistory,
    setShowHistory,
    loadHistoryItem: loadHistoryItemHook,
    deleteItem
  } = useHistory();

  const quoteRotation = useQuoteRotation(loading, inputText);

  // Refs
  const screenshotRef = useRef<HTMLDivElement>(null);

  // Initialize date
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  // Main fact-check handler
  const handleSubmit = async () => {
    // Clear any previous errors
    setError(null);
    clearImageError();

    // Validate input
    if (!inputText.trim() && !selectedImage) {
      setError("请输入文本或上传图片以开始核查。/ Please input text or upload an image to start verification.");
      return;
    }

    // Validate text length
    if (inputText.length > CONFIG.API.MAX_TEXT_LENGTH) {
      setError(`输入过长，最多允许 ${CONFIG.API.MAX_TEXT_LENGTH.toLocaleString()} 个字符。/ Input too long. Maximum ${CONFIG.API.MAX_TEXT_LENGTH.toLocaleString()} characters allowed.`);
      return;
    }

    setLoading(true);
    setResult(null);

    // Record start time for minimum display time
    const startTime = Date.now();

    try {
      let base64Image = undefined;
      let mimeType = undefined;

      if (imagePreview) {
        // Use safe parsing function
        const parsed = parseBase64DataUrl(imagePreview);
        if (parsed) {
          base64Image = parsed.base64;
          mimeType = parsed.mimeType;
        } else {
          setError('图片格式无效 / Invalid image format');
          setLoading(false);
          return;
        }
      }

      const data = await checkFacts(inputText, base64Image, mimeType);

      // Ensure minimum display time based on quote reading time
      const elapsedTime = Date.now() - startTime;
      const remainingTime = quoteRotation.minDisplayTime - elapsedTime;

      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }

      setResult(data);

      // Save to history
      addToHistory(inputText || '(Image only)', data);
    } catch (err) {
      logger.error('[handleSubmit] Error:', err);

      // API client now provides user-friendly error messages
      // Just use the error message directly
      const errorMessage = err instanceof Error ? err.message : "An error occurred during verification. Please try again. / 核查过程中发生错误，请重试。";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Screenshot functionality
  const handleScreenshot = async () => {
    if (!screenshotRef.current) {
      setError('No content to capture / 没有可截图的内容');
      return;
    }

    try {
      // Import html-to-image dynamically
      const { toPng } = await import('html-to-image');

      const element = screenshotRef.current;

      // Generate PNG with high quality
      const dataUrl = await toPng(element, {
        width: element.scrollWidth,
        height: element.scrollHeight,
        quality: 1,
        pixelRatio: 2, // Higher resolution
        backgroundColor: '#ffffff',
        style: {
          // Ensure the element has proper styling during capture
          width: `${element.scrollWidth}px`,
          height: 'auto',
          backgroundColor: '#ffffff',
        },
        cacheBust: true, // Avoid cached images
      });

      // Download the image
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `fact-check-${Date.now()}.png`;
      a.click();

    } catch (err) {
      logger.error('[handleScreenshot] Error:', err);
      setError('Screenshot failed / 截图失败');
    }
  };

  // Share functionality
  const handleShare = async () => {
    if (!result) return;

    const shareData = {
      title: 'Fact Check - Verification Result',
      text: `${result.verdict} - ${inputText.slice(0, 100)}...`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(
          `事实核查结果:\n${result.verdict}\n评分: ${result.score}/100\n\n${result.expert_advice}\n\n${window.location.href}`
        );
        alert('链接已复制到剪贴板！/ Link copied to clipboard!');
      }
    } catch (err) {
      logger.error('[handleShare] Error:', err);
    }
  };

  // Load history item
  const loadHistoryItem = (item: typeof history[0]) => {
    setInputText(item.input);
    setResult(item.result);
    setShowHistory(false);
    setError(null);
  };

  return (
    <div ref={screenshotRef} data-screenshot="true" className="min-h-screen bg-white text-black p-6 md:p-12 max-w-5xl mx-auto">

      {/* Header */}
      <header className="mb-12 border-b-4 border-black pb-4">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-serif-sc tracking-tighter">
              事实核查 <span className="font-light text-3xl">|</span> Fact Check
            </h1>
            <p className="text-sm uppercase tracking-widest mt-2 font-semibold flex flex-wrap items-center gap-2">
              <span className="bg-black text-white px-2 py-0.5">BETA</span>
              <span>专业事实核查工具 / Professional Fact-Checking Tool</span>
            </p>
          </div>
          <div className="text-right text-xs font-mono text-gray-600 hidden md:block">
            <p>全网搜证 / 来源核查 / 图片鉴别</p>
            <p className="mt-1">Web Search / Source Check / Image Verify</p>
            <p className="font-bold text-black mt-2">{currentDate}</p>
          </div>
        </div>
      </header>

      <main>
        {/* Input Section */}
        <InputSection
          inputText={inputText}
          setInputText={setInputText}
          imagePreview={imagePreview}
          selectedImageName={selectedImage?.name || ''}
          fileInputRef={fileInputRef}
          onSubmit={handleSubmit}
          onImageUpload={handleImageUpload}
          onRemoveImage={handleRemoveImage}
          onClearImageError={clearImageError}
          onScreenshot={handleScreenshot}
          onShare={handleShare}
          onToggleHistory={() => setShowHistory(!showHistory)}
          loading={loading}
          hasResult={!!result}
          historyCount={history.length}
          error={error}
          imageError={imageError}
        />

        {/* History Panel */}
        {showHistory && (
          <HistoryPanel
            history={history}
            onLoadItem={loadHistoryItem}
            onClear={clearHistory}
            onDeleteItem={deleteItem}
          />
        )}

        {/* Loading State - Truth Quote Display */}
        {loading && <LoadingQuote quote={quoteRotation.loadingQuote} />}

        {/* Results Section */}
        {result && !loading && <ResultSection result={result} />}

      </main>

      <footer className="mt-24 border-t border-gray-300 pt-8 mb-12 text-center text-xs text-gray-400 uppercase tracking-widest font-mono">
        事实核查 AI © {new Date().getFullYear()} | Skepticism reveals truth / 怀疑揭示真相
      </footer>
    </div>
  );
};

export default App;
