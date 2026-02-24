/**
 * Timeline Component
 * Displays the evidence timeline
 */

import React from 'react';
import { VerificationResult } from '../types';

interface TimelineProps {
  result: VerificationResult;
}

/**
 * Component displaying the evidence timeline
 */
export const Timeline: React.FC<TimelineProps> = ({ result }) => {
  return (
    <section className="border-t-4 border-black pt-8">
      <h3 className="font-bold uppercase mb-8 italic tracking-widest text-xl font-serif-sc">
        证据溯源时间轴 / Evidence Timeline
      </h3>
      <div className="space-y-0 border-l-2 border-black ml-3 md:ml-6">
        {result.timeline.map((item, index) => (
          <div key={index} className="relative pl-8 pb-8 last:pb-0">
            {/* Dot */}
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-black border-2 border-white ring-1 ring-black rounded-full"></div>

            <div className="flex flex-col sm:flex-row sm:gap-6">
              <div className="font-bold font-mono text-sm w-32 shrink-0 pt-1 text-gray-600">{item.time}</div>
              <div className="flex-1 text-sm font-medium leading-relaxed bg-gray-50 p-3 -mt-2 border border-gray-200">
                {item.event}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
