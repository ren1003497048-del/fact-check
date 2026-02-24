/**
 * AnalysisMatrix Component
 * Displays the 5-dimension analysis matrix
 */

import React from 'react';
import { VerificationResult } from '../types';
import * as Icons from './Icons';

interface AnalysisMatrixProps {
  result: VerificationResult;
}

/**
 * Component displaying the analysis matrix
 */
export const AnalysisMatrix: React.FC<AnalysisMatrixProps> = ({ result }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="border-2 border-black p-5 hover:bg-gray-50 transition">
        <h3 className="font-bold border-b border-black mb-3 pb-1 uppercase text-sm tracking-wide flex justify-between">
          ① 来源权威性 / SOURCE AUTHORITY
        </h3>
        <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap">{result.analysis.source}</p>
      </div>
      <div className="border-2 border-black p-5 hover:bg-gray-50 transition">
        <h3 className="font-bold border-b border-black mb-3 pb-1 uppercase text-sm tracking-wide flex justify-between">
          ② 语境一致性 / CONTEXT & CONSISTENCY
        </h3>
        <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap">{result.analysis.context}</p>
      </div>

      {/* Enhanced Logic & Sentiment Section */}
      <div className="border-2 border-black p-5 hover:bg-gray-50 transition md:col-span-2">
        <h3 className="font-bold border-b border-black mb-4 pb-1 uppercase text-sm tracking-wide flex justify-between">
          ③ 逻辑与舆论分层 / LOGIC & SENTIMENT
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap mb-4">
              {result.analysis.logic.summary}
            </p>
            <div className="mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase block mb-2">关键节点 / Amplification Nodes</span>
              <div className="flex flex-wrap gap-2">
                {result.analysis.logic.amplification_nodes.map((node, i) => (
                  <span key={i} className="text-xs font-mono bg-black text-white px-2 py-1 rounded-sm flex items-center gap-1">
                    <Icons.ShareIcon /> {node}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase block mb-2">舆论场 / Primary Opinion Field</span>
              <span className="text-xs font-bold border border-gray-400 text-gray-700 px-3 py-1 rounded-full">
                {result.analysis.logic.primary_opinion_field}
              </span>
            </div>
          </div>
          <div className="bg-gray-100 p-4 border-l-2 border-gray-300">
             <span className="text-xs font-bold text-gray-500 uppercase block mb-2">舆论分层辨析 / Layered Analysis</span>
             <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700 font-serif-sc">
               {result.analysis.logic.opinion_stratification}
             </p>
          </div>
        </div>
      </div>

      <div className="border-2 border-black p-5 hover:bg-gray-50 transition">
        <h3 className="font-bold border-b border-black mb-3 pb-1 uppercase text-sm tracking-wide flex justify-between">
          ④ 多源交叉验证 / CROSS-CHECK
        </h3>
        <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap">{result.analysis.cross_check}</p>
      </div>

      {result.analysis.visual && (
        <div className="border-2 border-black p-5 hover:bg-gray-50 transition">
          <h3 className="font-bold border-b border-black mb-3 pb-1 uppercase text-sm tracking-wide flex justify-between">
            ⑤ 视觉取证 / VISUAL FORENSICS
          </h3>
          <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap">{result.analysis.visual}</p>
        </div>
      )}
    </div>
  );
};
