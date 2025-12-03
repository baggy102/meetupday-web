'use client';

import { Checkbox, Select, Space, Typography } from 'antd';
import { Industry } from '@/types';

const { Text } = Typography;

interface FilterBarProps {
  selectedIndustries: Industry[];
  onIndustriesChange: (industries: Industry[]) => void;
  selectedRegions?: string[];
  onRegionsChange?: (regions: string[]) => void;
  selectedStages?: string[];
  onStagesChange?: (stages: string[]) => void;
  selectedSizes?: string[];
  onSizesChange?: (sizes: string[]) => void;
}

const industries: Industry[] = ['IT', '마케팅', '헬스케어', 'AI'];
const regions = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산'];
const stages = ['시드', '시리즈A', '시리즈B', '시리즈C', '성장기'];
const sizes = ['1-10명', '11-30명', '31-50명', '51-100명', '100명 이상'];

export function FilterBar({
  selectedIndustries,
  onIndustriesChange,
  selectedRegions = [],
  onRegionsChange,
  selectedStages = [],
  onStagesChange,
  selectedSizes = [],
  onSizesChange,
}: FilterBarProps) {
  const handleIndustryChange = (industry: Industry, checked: boolean) => {
    if (checked) {
      onIndustriesChange([...selectedIndustries, industry]);
    } else {
      onIndustriesChange(selectedIndustries.filter(i => i !== industry));
    }
  };

  const handleRegionChange = (region: string, checked: boolean) => {
    if (!onRegionsChange) return;
    if (checked) {
      onRegionsChange([...selectedRegions, region]);
    } else {
      onRegionsChange(selectedRegions.filter(r => r !== region));
    }
  };

  const handleStageChange = (stage: string, checked: boolean) => {
    if (!onStagesChange) return;
    if (checked) {
      onStagesChange([...selectedStages, stage]);
    } else {
      onStagesChange(selectedStages.filter(s => s !== stage));
    }
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    if (!onSizesChange) return;
    if (checked) {
      onSizesChange([...selectedSizes, size]);
    } else {
      onSizesChange(selectedSizes.filter(s => s !== size));
    }
  };

  const handleRegionSelect = (values: string[]) => {
    if (onRegionsChange) {
      onRegionsChange(values);
    }
  };

  const handleStageSelect = (values: string[]) => {
    if (onStagesChange) {
      onStagesChange(values);
    }
  };

  const handleSizeSelect = (values: string[]) => {
    if (onSizesChange) {
      onSizesChange(values);
    }
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        padding: '20px 24px',
        borderRadius: '8px',
        marginBottom: '24px',
        border: '1px solid #EAEAEA',
      }}
    >
      <Space direction="horizontal" size="middle" wrap style={{ width: '100%', alignItems: 'flex-start' }}>
        {/* 산업 카테고리 */}
        <div style={{ flex: '0 0 auto' }}>
          <Text style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '12px' }}>
            산업 카테고리
          </Text>
          <Space wrap>
            {industries.map((industry) => (
              <Checkbox
                key={industry}
                checked={selectedIndustries.includes(industry)}
                onChange={(e) => handleIndustryChange(industry, e.target.checked)}
              >
                <Text style={{ fontSize: '14px', color: '#0F172A' }}>{industry}</Text>
              </Checkbox>
            ))}
          </Space>
        </div>

        {/* 지역 드롭다운 */}
        <div style={{ flex: '0 0 auto', minWidth: '150px' }}>
          <Text style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '12px' }}>
            지역
          </Text>
          <Select
            mode="multiple"
            placeholder="지역 선택"
            value={selectedRegions}
            onChange={handleRegionSelect}
            style={{ width: '100%', minWidth: '150px' }}
            options={regions.map(region => ({ label: region, value: region }))}
            maxTagCount="responsive"
          />
        </div>

        {/* 단계 드롭다운 */}
        <div style={{ flex: '0 0 auto', minWidth: '150px' }}>
          <Text style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '12px' }}>
            단계
          </Text>
          <Select
            mode="multiple"
            placeholder="단계 선택"
            value={selectedStages}
            onChange={handleStageSelect}
            style={{ width: '100%', minWidth: '150px' }}
            options={stages.map(stage => ({ label: stage, value: stage }))}
            maxTagCount="responsive"
          />
        </div>

        {/* 규모 드롭다운 */}
        <div style={{ flex: '0 0 auto', minWidth: '150px' }}>
          <Text style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '12px' }}>
            규모
          </Text>
          <Select
            mode="multiple"
            placeholder="규모 선택"
            value={selectedSizes}
            onChange={handleSizeSelect}
            style={{ width: '100%', minWidth: '150px' }}
            options={sizes.map(size => ({ label: size, value: size }))}
            maxTagCount="responsive"
          />
        </div>
      </Space>
    </div>
  );
}

