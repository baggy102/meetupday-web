'use client';

import { Industry } from '@/types';
import { Radio } from 'antd';

interface IndustryFilterProps {
  selectedIndustry: Industry | 'all';
  onIndustryChange: (industry: Industry | 'all') => void;
}

const industries: (Industry | 'all')[] = ['all', 'IT', '마케팅', '헬스케어', 'AI'];

export function IndustryFilter({ selectedIndustry, onIndustryChange }: IndustryFilterProps) {
  return (
    <Radio.Group
      value={selectedIndustry}
      onChange={(e) => onIndustryChange(e.target.value)}
      buttonStyle="solid"
      size="large"
    >
      {industries.map((industry) => (
        <Radio.Button key={industry} value={industry}>
          {industry === 'all' ? '전체' : industry}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
}

