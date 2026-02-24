/**
 * useQuoteRotation Hook
 * Manages intelligent quote rotation during loading state
 */

import { useState, useEffect, useRef } from 'react';
import { CONFIG } from '../config/constants';
import { QuoteItem, detectContentType, selectQuotesByCategory } from '../constants/quotes';

export interface UseQuoteRotationState {
  loadingQuote: QuoteItem;
  currentQuoteIndex: number;
  availableQuotes: QuoteItem[];
}

/**
 * Hook for managing quote rotation during loading
 */
export function useQuoteRotation(loading: boolean, inputText: string) {
  const [state, setState] = useState<UseQuoteRotationState>({
    loadingQuote: (selectQuotesByCategory('general'))[0],
    currentQuoteIndex: 0,
    availableQuotes: selectQuotesByCategory('general')
  });
  const quoteRotationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize quotes based on input content
  useEffect(() => {
    if (loading && inputText) {
      const contentType = detectContentType(inputText);
      const quotes = selectQuotesByCategory(contentType);

      // Select first quote randomly
      const firstQuoteIndex = Math.floor(Math.random() * quotes.length);

      setState({
        loadingQuote: quotes[firstQuoteIndex],
        currentQuoteIndex: firstQuoteIndex,
        availableQuotes: quotes
      });
    }
  }, [loading, inputText]);

  // Auto-rotate quotes every 10 seconds if still loading
  useEffect(() => {
    if (loading && state.availableQuotes.length > 1) {
      // Clear any existing timer
      if (quoteRotationTimerRef.current) {
        clearTimeout(quoteRotationTimerRef.current);
      }

      // Set up rotation timer
      quoteRotationTimerRef.current = setTimeout(() => {
        const nextIndex = (state.currentQuoteIndex + 1) % state.availableQuotes.length;
        setState(prev => ({
          ...prev,
          currentQuoteIndex: nextIndex,
          loadingQuote: state.availableQuotes[nextIndex]
        }));
      }, CONFIG.QUOTE.ROTATION_INTERVAL_MS);

      // Cleanup on unmount or when loading stops
      return () => {
        if (quoteRotationTimerRef.current) {
          clearTimeout(quoteRotationTimerRef.current);
        }
      };
    }
  }, [loading, state.currentQuoteIndex, state.availableQuotes]);

  // Calculate minimum display time based on current quote's reading time
  const minDisplayTime = Math.max(
    CONFIG.QUOTE.MIN_DISPLAY_TIME_MS,
    state.loadingQuote.readTime * 1000
  );

  return {
    ...state,
    minDisplayTime
  };
}
