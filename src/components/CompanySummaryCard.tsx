'use client';

import { Company } from '@/types';
import { Card, Space, Typography, Tag, Button, List, Divider } from 'antd';
import { 
  BuildOutlined, 
  GlobalOutlined, 
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface CompanySummaryCardProps {
  company: Company;
  onMeetingRequest: () => void;
}

export function CompanySummaryCard({ company, onMeetingRequest }: CompanySummaryCardProps) {
  // 최근 밋업 가능 일정 (다음 2주, 예시 데이터)
  const upcomingDates = [
    { date: '2024-01-15', day: '월요일', time: '14:00' },
    { date: '2024-01-17', day: '수요일', time: '15:00' },
    { date: '2024-01-19', day: '금요일', time: '10:00' },
  ];

  return (
    <Card
      style={{
        position: 'sticky',
        top: '96px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      }}
      bodyStyle={{ padding: '24px' }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 요약 정보 */}
        <div>
          <Title level={5} style={{ margin: 0, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
            요약 정보
          </Title>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                산업 카테고리
              </Text>
              <Tag color="blue" style={{ margin: 0, padding: '4px 12px', fontSize: '13px' }}>
                {company.industry}
              </Tag>
            </div>
            {company.companySize && (
              <div>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                  <UserOutlined style={{ marginRight: '4px' }} />
                  팀 규모
                </Text>
                <Text style={{ fontSize: '14px', color: '#0F172A', fontWeight: 500 }}>
                  {company.companySize}
                </Text>
              </div>
            )}
            {company.website && (
              <div>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                  <GlobalOutlined style={{ marginRight: '4px' }} />
                  웹사이트
                </Text>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    fontSize: '14px', 
                    color: '#2563EB',
                    textDecoration: 'none',
                  }}
                >
                  {company.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </Space>
        </div>

        <Divider style={{ margin: '16px 0' }} />

        {/* 최근 밋업 가능 일정 */}
        <div>
          <Title level={5} style={{ margin: 0, marginBottom: '12px', fontSize: '16px', fontWeight: 600 }}>
            <CalendarOutlined style={{ marginRight: '6px', color: '#2563EB' }} />
            최근 밋업 가능 일정
          </Title>
          <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '12px' }}>
            다음 2주
          </Text>
          <List
            size="small"
            dataSource={upcomingDates}
            renderItem={(item) => (
              <List.Item
                style={{
                  padding: '8px 0',
                  borderBottom: '1px solid #F1F5F9',
                }}
              >
                <Space direction="vertical" size={2} style={{ width: '100%' }}>
                  <Text style={{ fontSize: '13px', fontWeight: 500, color: '#0F172A' }}>
                    {item.day}
                  </Text>
                  <Space>
                    <Text style={{ fontSize: '12px', color: '#6B7280' }}>
                      {item.date}
                    </Text>
                    <Text style={{ fontSize: '12px', color: '#6B7280' }}>
                      <ClockCircleOutlined style={{ marginRight: '4px' }} />
                      {item.time}
                    </Text>
                  </Space>
                </Space>
              </List.Item>
            )}
          />
        </div>

        <Divider style={{ margin: '16px 0' }} />

        {/* 밋업 신청 버튼 */}
        <Button
          type="primary"
          block
          size="large"
          icon={<CalendarOutlined />}
          onClick={onMeetingRequest}
          style={{
            height: '48px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          밋업 신청
        </Button>
      </Space>
    </Card>
  );
}

