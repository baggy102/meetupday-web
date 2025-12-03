'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Company, Industry } from '@/types';
import { getCompanyById, getCurrentUser, canCreateMeetingRequest, incrementMonthlyRequestCount, createMeetingRequest, getCompanyByUserId } from '@/lib/api';
import { MeetingCalendar } from '@/components/MeetingCalendar';
import { Card, Tag, Space, Typography, Avatar, Button, Divider, Row, Col, Alert, Descriptions } from 'antd';
import { UserOutlined, CodeOutlined, GlobalOutlined, BuildOutlined, CalendarOutlined } from '@ant-design/icons';
import { message } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const companyId = params.id as string;
    const foundCompany = getCompanyById(companyId);
    if (!foundCompany) {
      router.push('/');
      return;
    }
    setCompany(foundCompany);
  }, [params.id, router]);

  const handleRequestMeeting = () => {
    const user = getCurrentUser();
    if (!user || !user.isVerified) {
      message.warning('사업자 인증이 필요합니다.');
      router.push('/auth/login');
      return;
    }

    if (!canCreateMeetingRequest(user.id)) {
      setError('월 5회 제한에 도달했습니다. 다음 달에 다시 시도해주세요.');
      return;
    }

    setShowCalendar(true);
  };

  const handleSubmitMeetingRequest = () => {
    if (selectedDates.length === 0) {
      message.error('최소 1개의 날짜를 선택해주세요.');
      return;
    }

    if (selectedDates.length > 3) {
      message.error('최대 3개의 날짜만 선택 가능합니다.');
      return;
    }

    const user = getCurrentUser();
    if (!user || !company) return;

    // 사용자의 회사 찾기
    const userCompany = getCompanyByUserId(user.id);
    if (!userCompany) {
      message.error('회사 등록이 필요합니다. 먼저 회사를 등록해주세요.');
      router.push('/companies/register');
      return;
    }

    createMeetingRequest(userCompany.id, company.id, selectedDates);
    incrementMonthlyRequestCount(user.id);
    
    message.success('밋업 매칭 신청이 완료되었습니다.');
    router.push('/dashboard');
  };

  if (!company) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <Card>
          <Text>로딩 중...</Text>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 회사 헤더 */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
            {company.logo ? (
              <Avatar
                size={80}
                src={company.logo}
                icon={<BuildOutlined />}
                style={{ flexShrink: 0 }}
              />
            ) : (
              <Avatar
                size={80}
                icon={<BuildOutlined />}
                style={{ flexShrink: 0, backgroundColor: '#2563eb' }}
              />
            )}
            <div style={{ flex: 1 }}>
              <Title level={1} style={{ margin: 0, marginBottom: '8px' }}>
                {company.name}
              </Title>
              <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
              {company.industry}
              </Tag>
          </div>
        </div>

          <Divider />

          {/* 회사 소개 */}
          <div>
            <Title level={3} style={{ marginBottom: '12px' }}>회사 소개</Title>
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', color: '#4b5563' }}>
              {company.description}
            </Paragraph>
          </div>

          {/* 회사 정보 */}
          <div>
            <Title level={3} style={{ marginBottom: '12px' }}>회사 정보</Title>
            <Descriptions column={{ xs: 1, sm: 2 }} bordered>
              {company.companySize && (
                <Descriptions.Item label={<><UserOutlined /> 회사 규모</>}>
                  {company.companySize}
                </Descriptions.Item>
              )}
          {company.website && (
                <Descriptions.Item label={<><GlobalOutlined /> 웹사이트</>}>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                    style={{ color: '#2563eb' }}
                  >
                    {company.website}
                  </a>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>

          {/* 대표 기술 */}
          {company.mainTechnologies.length > 0 && (
            <div>
              <Title level={3} style={{ marginBottom: '12px' }}>
                <CodeOutlined /> 대표 기술
              </Title>
              <Space wrap>
                {company.mainTechnologies.map((tech, index) => (
                  <Tag key={index} color="default" style={{ fontSize: '14px', padding: '4px 12px' }}>
                    {tech}
                  </Tag>
                ))}
              </Space>
            </div>
          )}

          <Divider />

          {/* 밋업 매칭 신청 */}
        {showCalendar ? (
            <div>
              <Title level={3} style={{ marginBottom: '16px' }}>
                <CalendarOutlined /> 밋업 일정 선택 (최대 3개)
              </Title>
            {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  closable
                  onClose={() => setError('')}
                  style={{ marginBottom: '16px' }}
                />
            )}
            <MeetingCalendar
              selectedDates={selectedDates}
              onDatesChange={setSelectedDates}
              maxSelections={3}
            />
              <Space style={{ marginTop: '24px' }}>
                <Button type="primary" size="large" onClick={handleSubmitMeetingRequest}>
                신청하기
                </Button>
                <Button
                  size="large"
                onClick={() => {
                  setShowCalendar(false);
                  setSelectedDates([]);
                  setError('');
                }}
              >
                취소
                </Button>
              </Space>
          </div>
        ) : (
            <div>
              <Button
                type="primary"
                size="large"
                icon={<CalendarOutlined />}
              onClick={handleRequestMeeting}
            >
              밋업 매칭 신청하기
              </Button>
            {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  closable
                  onClose={() => setError('')}
                  style={{ marginTop: '16px' }}
                />
            )}
          </div>
        )}
        </Space>
      </Card>
    </div>
  );
}

