/**
 * ReferenceBadge Component
 * Displays reference type badges (SUPPORT/CONFLICT/NEUTRAL)
 */

import React from 'react';

interface ReferenceBadgeProps {
  type: string;
}

/**
 * Component displaying reference type badge
 */
export const ReferenceBadge: React.FC<ReferenceBadgeProps> = ({ type }) => {
  switch(type) {
    case 'CONFLICT':
      return (
        <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
          存在出入 / CONFLICT
        </span>
      );
    case 'SUPPORT':
      return (
        <span className="border border-black text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
          证实 / SUPPORT
        </span>
      );
    default:
      return (
        <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
          参考 / NEUTRAL
        </span>
      );
  }
};
