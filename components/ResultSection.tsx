/**
 * ResultSection Component
 * Main wrapper for displaying fact-check results
 */

import React from 'react';
import { VerificationResult } from '../types';
import { VerdictBanner } from './VerdictBanner';
import { AnalysisMatrix } from './AnalysisMatrix';
import { Timeline } from './Timeline';
import { SourceList } from './SourceList';

interface ResultSectionProps {
  result: VerificationResult;
}

/**
 * Main component for displaying verification results
 */
export const ResultSection: React.FC<ResultSectionProps> = ({ result }) => {
  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Verdict Banner */}
      <VerdictBanner result={result} />

      {/* Expert Advice / Lead */}
      <div className="p-5 border-l-4 border-black bg-gray-100 text-lg">
        <span className="font-bold font-sans text-xs uppercase block mb-3 text-gray-500">编辑手记 / Editor's Note</span>
        <div className="whitespace-pre-wrap leading-relaxed font-normal">{result.expert_advice}</div>
      </div>

      {/* Evaluation Matrix */}
      <AnalysisMatrix result={result} />

      {/* Evidence Timeline */}
      <Timeline result={result} />

      {/* Source Analysis & Discrepancies */}
      <SourceList result={result} />
    </div>
  );
};
