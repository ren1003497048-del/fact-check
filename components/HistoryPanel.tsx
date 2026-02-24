/**
 * HistoryPanel Component
 * Displays and manages verification history
 */

import React from 'react';
import { HistoryEntry } from '../hooks/useHistory';
import * as Icons from './Icons';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onLoadItem: (item: HistoryEntry) => void;
  onClear: () => void;
  onDeleteItem: (id: string) => void;
}

/**
 * Component that displays history of fact-checks
 */
export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onLoadItem,
  onClear,
  onDeleteItem
}) => {
  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'REAL': return 'text-green-700';
      case 'FAKE': return 'text-red-600';
      case 'MISLEADING': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="mt-4 border-2 border-black bg-white shadow-lg">
      <div className="p-4 border-b-2 border-black flex justify-between items-center">
        <h3 className="font-bold uppercase text-sm">历史记录 / History ({history.length})</h3>
        <button
          onClick={onClear}
          className="text-xs text-red-600 hover:underline font-bold"
        >
          清空所有 / Clear All
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {history.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            暂无历史记录 / No history yet
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="p-4 border-b border-gray-200 hover:bg-gray-50 transition group"
            >
              <div className="flex justify-between items-start gap-4">
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => onLoadItem(item)}
                >
                  <p className="text-xs font-mono text-gray-500 mb-1">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                  <p className="text-sm font-medium truncate">{item.input}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-xs font-bold ${getVerdictColor(item.result.verdict)}`}>
                      {item.result.verdict}
                    </span>
                    <span className="text-xs text-gray-500">
                      Score: {item.result.score}/100
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteItem(item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition p-1"
                  title="删除 / Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
