'use client';

import { useState } from 'react';
import { Checkbox, Collapse, Space, Typography, Tag } from 'antd';
import { Industry } from '@/types';
import { UpOutlined, DownOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Title, Text } = Typography;

interface FilterSidebarProps {
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

export function FilterSidebar({
  selectedIndustries,
  onIndustriesChange,
  selectedRegions = [],
  onRegionsChange,
  selectedStages = [],
  onStagesChange,
  selectedSizes = [],
  onSizesChange,
}: FilterSidebarProps) {
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

  const clearAllFilters = () => {
    onIndustriesChange([]);
    if (onRegionsChange) onRegionsChange([]);
    if (onStagesChange) onStagesChange([]);
    if (onSizesChange) onSizesChange([]);
  };

  const hasActiveFilters = selectedIndustries.length > 0 || 
    selectedRegions.length > 0 || 
    selectedStages.length > 0 || 
    selectedSizes.length > 0;

  return (
    <div
      style={{
        width: '100%',
        background: '#FFFFFF',
        height: '100%',
        overflowY: 'auto',
        padding: '0',
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 필터 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={5} style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#0F172A' }}>
            필터
          </Title>
          {hasActiveFilters && (
            <Text
              onClick={clearAllFilters}
              style={{
                fontSize: '12px',
                color: '#2563EB',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              전체 해제
            </Text>
          )}
        </div>

        {/* 산업 카테고리 */}
        <div>
          <Title level={5} style={{ margin: 0, marginBottom: '12px', fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
            산업 카테고리
          </Title>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {industries.map((industry) => (
              <Checkbox
                key={industry}
                checked={selectedIndustries.includes(industry)}
                onChange={(e) => handleIndustryChange(industry, e.target.checked)}
                style={{
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: '14px', color: '#0F172A' }}>{industry}</Text>
              </Checkbox>
            ))}
          </Space>
        </div>

        {/* 지역/단계/규모 필터 (아코디언) */}
        <Collapse
          ghost
          expandIcon={({ isActive }) => (isActive ? <UpOutlined /> : <DownOutlined />)}
          style={{ background: 'transparent' }}
        >
          <Panel
            header={
              <Text style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
                지역
              </Text>
            }
            key="region"
          >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {regions.map((region) => (
                <Checkbox
                  key={region}
                  checked={selectedRegions.includes(region)}
                  onChange={(e) => handleRegionChange(region, e.target.checked)}
                  style={{
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: '14px', color: '#0F172A' }}>{region}</Text>
                </Checkbox>
              ))}
            </Space>
          </Panel>

          <Panel
            header={
              <Text style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
                단계
              </Text>
            }
            key="stage"
          >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {stages.map((stage) => (
                <Checkbox
                  key={stage}
                  checked={selectedStages.includes(stage)}
                  onChange={(e) => handleStageChange(stage, e.target.checked)}
                  style={{
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: '14px', color: '#0F172A' }}>{stage}</Text>
                </Checkbox>
              ))}
            </Space>
          </Panel>

          <Panel
            header={
              <Text style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
                규모
              </Text>
            }
            key="size"
          >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {sizes.map((size) => (
                <Checkbox
                  key={size}
                  checked={selectedSizes.includes(size)}
                  onChange={(e) => handleSizeChange(size, e.target.checked)}
                  style={{
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: '14px', color: '#0F172A' }}>{size}</Text>
                </Checkbox>
              ))}
            </Space>
          </Panel>
        </Collapse>
      </Space>
    </div>
  );
}

