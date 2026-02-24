/**
 * SourceList Component
 * Displays source analysis and discrepancies
 */

import React from 'react';
import { VerificationResult } from '../types';
import { ReferenceBadge } from './ReferenceBadge';
import * as Icons from './Icons';
import DOMPurify from 'dompurify';

interface SourceListProps {
  result: VerificationResult;
}

/**
 * Component displaying source analysis
 */
export const SourceList: React.FC<SourceListProps> = ({ result }) => {
  return (
    <section className="border-t-4 border-black pt-8">
      <h3 className="font-bold uppercase mb-8 italic tracking-widest text-xl font-serif-sc flex items-center gap-3">
        来源分析与差异 / Source Analysis
      </h3>

      {result.references && result.references.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {result.references.map((ref, index) => (
            <div key={index} className="group flex flex-col sm:flex-row items-start gap-4 p-4 border-l-2 border-black hover:bg-gray-50 transition-colors">
              <div className="flex flex-col gap-2 shrink-0 w-full sm:w-48">
                <span className="font-bold text-sm truncate" title={ref.source_name}>{ref.source_name}</span>
                <div><ReferenceBadge type={ref.type} /></div>
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="text-sm text-gray-800 leading-relaxed font-medium mb-1 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(ref.note) }}
                />
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-black flex items-center gap-1 mt-2 underline decoration-gray-300 hover:decoration-black underline-offset-2 break-all"
                >
                  {ref.url} <Icons.LinkIcon />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 bg-gray-50 text-center text-sm text-gray-500 border border-gray-200 border-dashed">
          暂无发现差异来源 / No specific discrepancy sources found.
        </div>
      )}
    </section>
  );
};
