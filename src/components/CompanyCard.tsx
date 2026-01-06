'use client';

import { useState } from 'react';
import { Company } from '@/types';
import { Tag, Space, Typography, Avatar, Button } from 'antd';
import { BuildOutlined, HeartOutlined, HeartFilled, ArrowRightOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface CompanyCardProps {
  company: Company;
  onClick: () => void;
  isClickable: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: (companyId: string, isFavorite: boolean) => void;
}

export default function CompanyCard({ 
  company, 
  onClick, 
  isClickable,
  isFavorite: initialFavorite = false,
  onFavoriteToggle,
}: CompanyCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    if (onFavoriteToggle) {
      onFavoriteToggle(company.id, newFavoriteState);
    }
  };

  const handleCardClick = () => {
    if (isClickable) {
      onClick();
    }
  };

  const tags = [
    company.industry,
    ...(company.mainTechnologies?.slice(0, 2) || [])
  ].filter(Boolean);

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        maxWidth: '320px',
        height: '240px',
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '20px',
        cursor: isClickable ? 'pointer' : 'not-allowed',
        opacity: isClickable ? 1 : 0.6,
        border: isHovered && isClickable ? '2px solid #3B82F6' : '1px solid #EAEAEA',
        boxShadow: isHovered && isClickable 
          ? '0 8px 24px rgba(0, 0, 0, 0.12)' 
          : '0 2px 8px rgba(0, 0, 0, 0.08)',
        transform: isHovered && isClickable ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* 상단: 로고 + 회사명 */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
        {company.logo ? (
          <Avatar
            size={48}
            src={company.logo}
            icon={<BuildOutlined />}
            style={{ 
              flexShrink: 0,
              borderRadius: '8px',
            }}
          />
        ) : (
          <Avatar
            size={48}
            icon={<BuildOutlined />}
            style={{ 
              flexShrink: 0, 
              backgroundColor: '#2563EB',
              borderRadius: '8px',
            }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Typography.Title 
            level={5} 
            style={{ 
              margin: 0, 
              fontSize: '17px', 
              fontWeight: 600,
              color: '#0F172A',
              lineHeight: '1.4',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {company.name}
          </Typography.Title>
        </div>
      </div>

      {/* 태그 (산업/키워드 pill) */}
      {tags.length > 0 && (
        <div style={{ marginBottom: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {tags.slice(0, 3).map((tag, index) => (
            <Tag
              key={index}
              style={{
                margin: 0,
                padding: '2px 8px',
                fontSize: '12px',
                borderRadius: '12px',
                background: '#F5F5F5',
                color: '#0F172A',
                border: '1px solid #EAEAEA',
              }}
            >
              {tag}
            </Tag>
          ))}
        </div>
      )}

      {/* 요약 (2-3줄) */}
      <Paragraph
        ellipsis={{ rows: 3, expandable: false }}
        style={{ 
          margin: 0, 
          marginBottom: 'auto',
          color: '#6B7280', 
          fontSize: '14px',
          lineHeight: '1.5',
          minHeight: '63px', // 3줄 높이
        }}
      >
        {company.description}
      </Paragraph>

      {/* 하단: CTA 버튼 + 하트 아이콘 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid #F1F5F9',
      }}>
        <Button
          type="text"
          size="small"
          icon={<ArrowRightOutlined />}
          iconPosition="end"
          onClick={(e) => {
            e.stopPropagation();
            if (isClickable) onClick();
          }}
          style={{
            padding: 0,
            height: 'auto',
            fontSize: '14px',
            fontWeight: 500,
            color: '#2563EB',
          }}
        >
          소개 보기
        </Button>
        <Button
          type="text"
          size="small"
          icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
          onClick={handleFavoriteClick}
          style={{
            padding: '4px',
            height: 'auto',
            fontSize: '18px',
            color: isFavorite ? '#0F172A' : '#9CA3AF',
          }}
        />
      </div>
    </div>
  );
}

