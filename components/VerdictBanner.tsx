/**
 * VerdictBanner Component
 * Displays the verdict (REAL/FAKE/MISLEADING/UNVERIFIED) and confidence score
 */

import React from 'react';
import { VerificationResult } from '../types';
import { VerdictType } from '../types';

interface VerdictBannerProps {
  result: VerificationResult;
}

/**
 * Get CSS class for verdict color
 */
function getVerdictColor(verdict: string): string {
  switch (verdict) {
    case 'REAL': return 'text-green-700';
    case 'FAKE': return 'text-red-600';
    case 'MISLEADING': return 'text-orange-600';
    default: return 'text-gray-600';
  }
}

/**
 * Get localized verdict text
 */
function getVerdictText(verdict: string): string {
  switch (verdict) {
    case 'REAL': return VerdictType.REAL;
    case 'FAKE': return VerdictType.FAKE;
    case 'MISLEADING': return VerdictType.MISLEADING;
    default: return VerdictType.UNVERIFIED;
  }
}

/**
 * Component displaying verdict and confidence score
 */
export const VerdictBanner: React.FC<VerdictBannerProps> = ({ result }) => {
  return (
    <div className="border-heavy p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gray-50">
      <div>
        <span className="text-sm font-bold uppercase block mb-1 tracking-wider text-gray-500">核查定性 / Verdict</span>
        <h2 className={`text-4xl md:text-5xl font-bold font-serif-sc italic ${getVerdictColor(result.verdict)}`}>
          {getVerdictText(result.verdict)}
        </h2>
      </div>
      <div className="text-right w-full md:w-auto border-t md:border-t-0 border-gray-300 pt-4 md:pt-0">
        <span className="text-sm font-bold block mb-1 tracking-wider text-gray-500">可信度 / Confidence Score</span>
        <div className="flex items-baseline justify-end gap-1">
           <span className="text-6xl font-mono font-bold">{result.score}</span>
           <span className="text-xl font-mono text-gray-400">/100</span>
        </div>
      </div>
    </div>
  );
};
