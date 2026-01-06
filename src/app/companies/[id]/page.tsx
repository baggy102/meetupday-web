'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Company } from '@/types';
import { getCompanyById, getCurrentUser, canCreateMeetingRequest, incrementMonthlyRequestCount, createMeetingRequest, getCompanyByUserId } from '@/lib/api';
import { CompanyHero } from '@/components/CompanyHero';
import { CompanyTabs } from '@/components/CompanyTabs';
import { CompanySummaryCard } from '@/components/CompanySummaryCard';
import { MeetingRequestModal } from '@/components/MeetingRequestModal';
import { Typography, Row, Col, Alert } from 'antd';
import { message } from 'antd';

const { Text } = Typography;

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      message.error('월 5회 제한에 도달했습니다. 다음 달에 다시 시도해주세요.');
      return;
    }

    setShowModal(true);
    setError('');
  };

  const handleSubmitMeetingRequest = (dates: Date[], purpose: string) => {
    const user = getCurrentUser();
    if (!user || !company) return;

    // 사용자의 회사 찾기
    const userCompany = getCompanyByUserId(user.id);
    if (!userCompany) {
      message.error('회사 등록이 필요합니다. 먼저 회사를 등록해주세요.');
      router.push('/companies/register');
      return;
    }

    createMeetingRequest(userCompany.id, company.id, dates);
    incrementMonthlyRequestCount(user.id);
    
    message.success('밋업 매칭 신청이 완료되었습니다.');
    router.push('/dashboard');
  };

  if (!company) {
    return (
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 24px' }}>
        <Text>로딩 중...</Text>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1440px', 
      margin: '0 auto', 
      padding: '32px 24px',
      background: '#F8FAFC',
      minHeight: 'calc(100vh - 64px)',
    }}>
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={() => setError('')}
          style={{ marginBottom: '24px' }}
        />
      )}

      {/* Hero 영역 */}
      <CompanyHero company={company} onMeetingRequest={handleRequestMeeting} />

      {/* 본문 레이아웃: 좌측 상세 / 우측 요약 */}
      <Row gutter={[24, 24]}>
        {/* 좌측: 상세 정보 (65%) */}
        <Col xs={24} lg={16}>
          <CompanyTabs company={company} />
        </Col>

        {/* 우측: 요약 카드 (35%) - 데스크톱에서만 sticky */}
        {!isMobile && (
          <Col xs={24} lg={8}>
            <CompanySummaryCard 
              company={company} 
              onMeetingRequest={handleRequestMeeting}
            />
          </Col>
        )}
      </Row>

      {/* 모바일: 요약 카드 (하단) */}
      {isMobile && (
        <div style={{ marginTop: '24px' }}>
          <CompanySummaryCard 
            company={company} 
            onMeetingRequest={handleRequestMeeting}
          />
        </div>
      )}

      {/* 밋업 신청 모달 */}
      <MeetingRequestModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitMeetingRequest}
        companyName={company.name}
      />
    </div>
  );
}

