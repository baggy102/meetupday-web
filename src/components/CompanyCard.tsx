'use client';

import { Company } from '@/types';
import { Card, Tag, Space, Typography, Avatar } from 'antd';
import { UserOutlined, CodeOutlined, BuildOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface CompanyCardProps {
  company: Company;
  onClick: () => void;
  isClickable: boolean;
}

export default function CompanyCard({ company, onClick, isClickable }: CompanyCardProps) {
  return (
    <Card
      hoverable={isClickable}
      onClick={isClickable ? onClick : undefined}
      style={{
        cursor: isClickable ? 'pointer' : 'not-allowed',
        opacity: isClickable ? 1 : 0.6,
        height: '100%',
        transition: 'all 0.3s ease',
      }}
      bodyStyle={{ padding: '20px' }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            {company.logo ? (
              <Avatar
                size={48}
                src={company.logo}
                icon={<BuildOutlined />}
                style={{ flexShrink: 0 }}
              />
            ) : (
              <Avatar
                size={48}
                icon={<BuildOutlined />}
                style={{ flexShrink: 0, backgroundColor: '#2563eb' }}
              />
            )}
            <Typography.Title level={4} style={{ margin: 0, fontSize: '18px' }}>
              {company.name}
            </Typography.Title>
          </div>
          <Tag color="blue" style={{ margin: 0, flexShrink: 0 }}>
            {company.industry}
          </Tag>
        </div>

        <Paragraph
          ellipsis={{ rows: 2, expandable: false }}
          style={{ margin: 0, color: '#6b7280', minHeight: '48px' }}
        >
          {company.description}
        </Paragraph>

        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          {company.companySize && (
            <Space>
              <UserOutlined style={{ color: '#9ca3af' }} />
              <Text type="secondary" style={{ fontSize: '14px' }}>
                {company.companySize}
              </Text>
            </Space>
          )}
          {company.mainTechnologies && company.mainTechnologies.length > 0 && (
            <Space wrap>
              <CodeOutlined style={{ color: '#9ca3af' }} />
              <Text type="secondary" style={{ fontSize: '14px' }}>
                {company.mainTechnologies.slice(0, 3).join(', ')}
                {company.mainTechnologies.length > 3 && '...'}
              </Text>
            </Space>
          )}
        </Space>

        {!isClickable && (
          <Text type="danger" style={{ fontSize: '12px' }}>
            * 사업자 인증이 필요합니다
          </Text>
        )}
      </Space>
    </Card>
  );
}

