'use client';

import { Industry } from '@/types';
import { cn } from '@/lib/utils';

interface IndustryFilterProps {
  selectedIndustry: Industry | 'all';
  onIndustryChange: (industry: Industry | 'all') => void;
}

const industries: (Industry | 'all')[] = ['all', 'IT', '마케팅', '헬스케어', 'AI'];

export function IndustryFilter({ selectedIndustry, onIndustryChange }: IndustryFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {industries.map((industry) => (
        <button
          key={industry}
          onClick={() => onIndustryChange(industry)}
          className={cn(
            'px-4 py-2 rounded-md font-medium transition-colors',
            selectedIndustry === industry
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          )}
        >
          {industry === 'all' ? '전체' : industry}
        </button>
      ))}
    </div>
  );
}

