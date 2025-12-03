'use client';

import { Company } from '@/types';
import { Tabs, Typography, Space, Tag, Descriptions, List, Avatar } from 'antd';
import { 
  BuildOutlined, 
  GlobalOutlined, 
  CodeOutlined, 
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface CompanyTabsProps {
  company: Company;
}

export function CompanyTabs({ company }: CompanyTabsProps) {
  const tabItems = [
    {
      key: 'about',
      label: '회사 소개',
      children: (
        <div style={{ padding: '24px 0' }}>
          <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', color: '#0F172A', marginBottom: '24px' }}>
            {company.description}
          </Paragraph>
          {company.website && (
            <div>
              <Title level={4} style={{ marginBottom: '12px', fontSize: '18px', fontWeight: 600 }}>
                <GlobalOutlined style={{ marginRight: '8px', color: '#2563EB' }} />
                웹사이트
              </Title>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  color: '#2563EB', 
                  fontSize: '16px',
                  textDecoration: 'none',
                }}
              >
                {company.website}
              </a>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'products',
      label: '제품',
      children: (
        <div style={{ padding: '24px 0' }}>
          <Paragraph style={{ fontSize: '16px', color: '#6B7280' }}>
            제품 정보가 곧 업데이트될 예정입니다.
          </Paragraph>
        </div>
      ),
    },
    {
      key: 'team',
      label: '팀',
      children: (
        <div style={{ padding: '24px 0' }}>
          <Descriptions column={1} bordered>
            <Descriptions.Item label={<><UserOutlined /> 회사 규모</>}>
              {company.companySize || '정보 없음'}
            </Descriptions.Item>
            <Descriptions.Item label={<><BuildOutlined /> 산업 분야</>}>
              {company.industry}
            </Descriptions.Item>
          </Descriptions>
        </div>
      ),
    },
    {
      key: 'meeting',
      label: '밋업 정보',
      children: (
        <div style={{ padding: '24px 0' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={4} style={{ marginBottom: '12px', fontSize: '18px', fontWeight: 600 }}>
                <CalendarOutlined style={{ marginRight: '8px', color: '#2563EB' }} />
                밋업 가능 요일
              </Title>
              <Space wrap>
                {['월', '화', '수', '목', '금'].map(day => (
                  <Tag key={day} style={{ padding: '4px 12px', fontSize: '14px' }}>
                    {day}요일
                  </Tag>
                ))}
              </Space>
            </div>
            <div>
              <Title level={4} style={{ marginBottom: '12px', fontSize: '18px', fontWeight: 600 }}>
                <ClockCircleOutlined style={{ marginRight: '8px', color: '#2563EB' }} />
                선호 시간대
              </Title>
              <Text style={{ fontSize: '16px', color: '#0F172A' }}>
                오전 10시 ~ 오후 6시
              </Text>
            </div>
            <div>
              <Title level={4} style={{ marginBottom: '12px', fontSize: '18px', fontWeight: 600 }}>
                <CheckCircleOutlined style={{ marginRight: '8px', color: '#2563EB' }} />
                평균 소요시간
              </Title>
              <Text style={{ fontSize: '16px', color: '#0F172A' }}>
                1-2시간
              </Text>
            </div>
            <div>
              <Title level={4} style={{ marginBottom: '12px', fontSize: '18px', fontWeight: 600 }}>
                선호 주제
              </Title>
              <Space wrap>
                {company.mainTechnologies?.slice(0, 5).map((tech, index) => (
                  <Tag key={index} color="blue" style={{ padding: '4px 12px', fontSize: '14px' }}>
                    {tech}
                  </Tag>
                ))}
              </Space>
            </div>
          </Space>
        </div>
      ),
    },
    {
      key: 'reviews',
      label: '후기',
      children: (
        <div style={{ padding: '24px 0' }}>
          <Paragraph style={{ fontSize: '16px', color: '#6B7280' }}>
            아직 등록된 후기가 없습니다.
          </Paragraph>
        </div>
      ),
    },
  ];

  return (
    <Tabs
      items={tabItems}
      defaultActiveKey="about"
      style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        padding: '24px',
      }}
    />
  );
}

