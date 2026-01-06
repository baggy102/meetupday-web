'use client';

import { useState, useEffect } from 'react';
import { Company } from '@/types';
import { Avatar, Button, Space, Typography, Tag } from 'antd';
import { BuildOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface CompanyHeroProps {
  company: Company;
  onMeetingRequest: () => void;
}

export function CompanyHero({ company, onMeetingRequest }: CompanyHeroProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      style={{
        minHeight: '280px',
        height: 'auto',
        background: 'linear-gradient(135deg, #F5F5F5 0%, #E5E5E5 100%)',
        borderRadius: '16px',
        padding: isMobile ? '24px' : '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '32px',
        flexWrap: 'wrap',
      }}
    >
      {/* 배경 블러 효과 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: company.logo 
            ? `url(${company.logo}) center/cover` 
            : 'linear-gradient(135deg, #F5F5F5 0%, #E5E5E5 100%)',
          filter: 'blur(40px)',
          opacity: 0.3,
          zIndex: 0,
        }}
      />

      {/* 컨텐츠 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '24px',
        flex: 1,
        zIndex: 1,
        position: 'relative',
        flexWrap: 'wrap',
      }}>
        <Avatar
          size={88}
          src={company.logo}
          icon={<BuildOutlined />}
          style={{
            flexShrink: 0,
            backgroundColor: '#FFFFFF',
            border: '4px solid rgba(255, 255, 255, 0.3)',
          }}
        />
        <div style={{ flex: 1 }}>
          <Title
            level={1}
            style={{
              margin: 0,
              marginBottom: '12px',
              fontSize: '32px',
              fontWeight: 700,
              color: '#0F172A',
            }}
          >
            {company.name}
          </Title>
          <Text
            style={{
              fontSize: '18px',
              color: '#6B7280',
              fontWeight: 500,
              display: 'block',
              marginBottom: '12px',
            }}
          >
            {company.description.split('.')[0]}.
          </Text>
          <Space>
            <Tag
              style={{
                background: '#F5F5F5',
                color: '#0F172A',
                border: '1px solid #EAEAEA',
                padding: '4px 12px',
                fontSize: '14px',
                borderRadius: '16px',
              }}
            >
              {company.industry}
            </Tag>
            {company.companySize && (
              <Tag
                style={{
                  background: '#F5F5F5',
                  color: '#0F172A',
                  border: '1px solid #EAEAEA',
                  padding: '4px 12px',
                  fontSize: '14px',
                  borderRadius: '16px',
                }}
              >
                {company.companySize}
              </Tag>
            )}
          </Space>
        </div>
      </div>

      {/* 우측: 밋업 신청 버튼 */}
      <div style={{ zIndex: 1, position: 'relative', width: isMobile ? '100%' : 'auto', marginTop: isMobile ? '16px' : 0 }}>
        <Button
          type="primary"
          size="large"
          icon={<CalendarOutlined />}
          onClick={onMeetingRequest}
          block={isMobile}
          style={{
            height: '48px',
            width: isMobile ? '100%' : '180px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 600,
            background: '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          밋업 신청
        </Button>
      </div>
    </div>
  );
}

