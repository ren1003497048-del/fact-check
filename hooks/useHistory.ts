/**
 * useHistory Hook
 * Manages verification history with localStorage persistence
 */

import { useState, useEffect, useCallback } from 'react';
import { VerificationResult } from '../types';
import { CONFIG } from '../config/constants';

export interface HistoryEntry {
  id: string;
  timestamp: number;
  input: string;
  result: VerificationResult;
}

export interface useHistoryState {
  history: HistoryEntry[];
  showHistory: boolean;
}

export interface useHistoryActions {
  setShowHistory: (show: boolean) => void;
  addToHistory: (input: string, result: VerificationResult) => void;
  loadHistoryItem: (item: HistoryEntry) => void;
  clearHistory: () => void;
  deleteItem: (id: string) => void;
}

/**
 * Hook for managing verification history
 */
export function useHistory() {
  const [state, setState] = useState<UseHistoryState>({
    history: [],
    showHistory: false
  });

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(CONFIG.HISTORY.STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setState(prev => ({ ...prev, history: parsed }));
      } catch (e) {
        console.error('[useHistory] Failed to load history:', e);
      }
    }
  }, []);

  const addToHistory = useCallback((input: string, result: VerificationResult) => {
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      input: input || '(Image only)',
      result
    };

    const updatedHistory = [newEntry, ...state.history].slice(0, CONFIG.HISTORY.MAX_ENTRIES);

    try {
      localStorage.setItem(CONFIG.HISTORY.STORAGE_KEY, JSON.stringify(updatedHistory));
      setState(prev => ({ ...prev, history: updatedHistory }));
    } catch (quotaError) {
      if (quotaError instanceof DOMException && quotaError.name === 'QuotaExceededError') {
        // Keep only recent entries
        const trimmedHistory = updatedHistory.slice(0, CONFIG.HISTORY.TRIM_ON_QUOTA);
        setState(prev => ({ ...prev, history: trimmedHistory }));
        try {
          localStorage.setItem(CONFIG.HISTORY.STORAGE_KEY, JSON.stringify(trimmedHistory));
        } catch {
          // Storage completely full - notify user
          console.warn('[useHistory] Storage quota exceeded, cannot save history');
        }
      } else {
        throw quotaError;
      }
    }
  }, [state.history]);

  const clearHistory = useCallback(() => {
    if (confirm('Clear all history? / 清空所有历史记录？')) {
      setState(prev => ({ ...prev, history: [] }));
      localStorage.removeItem(CONFIG.HISTORY.STORAGE_KEY);
    }
  }, []);

  const setShowHistory = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showHistory: show }));
  }, []);

  const loadHistoryItem = useCallback((item: HistoryEntry) => {
    // This will be handled by the parent component
    // Just return the item for now
    return item;
  }, []);

  const deleteItem = useCallback((id: string) => {
    const updatedHistory = state.history.filter(item => item.id !== id);

    try {
      localStorage.setItem(CONFIG.HISTORY.STORAGE_KEY, JSON.stringify(updatedHistory));
      setState(prev => ({ ...prev, history: updatedHistory }));
    } catch (e) {
      console.error('[useHistory] Failed to delete item:', e);
    }
  }, [state.history]);

  return {
    ...state,
    addToHistory,
    clearHistory,
    setShowHistory,
    loadHistoryItem,
    deleteItem
  };
}
