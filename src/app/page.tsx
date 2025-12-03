'use client';

import { useEffect, useState } from 'react';
import CompanyCard from '@/components/CompanyCard';
import { IndustryFilter } from '@/components/IndustryFilter';
import { Company, Industry } from '@/types';
import { getCompanies, initializeMockData, getCurrentUser } from '@/lib/mockData';
import { useRouter } from 'next/navigation';
import { Typography, Row, Col, Empty, Space } from 'antd';

const { Title, Paragraph } = Typography;

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | 'all'>('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 먼저 mock 데이터 초기화
    initializeMockData();
    
    // 인증 상태 확인
    const user = getCurrentUser();
    setIsAuthenticated(user?.isVerified || false);

    // 회사 목록 로드 (초기화 후에 호출)
    const data = getCompanies();
    console.log('Loaded companies:', data.length, data); // 디버깅용
    setCompanies(data);
    setFilteredCompanies(data);
  }, []);

  useEffect(() => {
    if (selectedIndustry === 'all') {
      setFilteredCompanies(companies);
    } else {
      setFilteredCompanies(companies.filter(c => c.industry === selectedIndustry));
    }
  }, [selectedIndustry, companies]);

  const handleCompanyClick = (company: Company) => {
    if (!isAuthenticated) {
      alert('회사 정보를 보려면 사업자 인증이 필요합니다. 로그인 후 회원가입을 완료해주세요.');
      router.push('/auth/login');
      return;
    }
    router.push(`/companies/${company.id}`);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', background:'#f7f9fc', borderRadius:'12px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%', marginBottom: '32px' }}>
        <div>
          <Title level={1} style={{ margin: 0, marginBottom: '12px', fontSize: '36px', fontWeight: 700, color:'#2563eb' }}>
            MeetupDay
          </Title>
          <Paragraph style={{ fontSize: '18px', color: '#6b7280', margin: 0 }}>
            스타트업 간 협업과 밋업을 위한 B2B 매칭 플랫폼
          </Paragraph>
        </div>

        <IndustryFilter
          selectedIndustry={selectedIndustry}
          onIndustryChange={setSelectedIndustry}
        />
      </Space>

      <div style={{ marginTop: '32px' }}>
        <Title level={2} style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 600, color:'#155cc8', letterSpacing:'-1px' }}>
          {selectedIndustry === 'all' ? '전체 회사' : `${selectedIndustry} 회사`} ({filteredCompanies.length})
        </Title>

        {filteredCompanies.length === 0 ? (
          <Empty 
            description="등록된 회사가 없습니다." 
            style={{ padding: '48px 0' }}
          />
        ) : (
          <Row gutter={[24, 24]}>
            {filteredCompanies.map((company) => (
              <Col xs={24} sm={12} lg={8} key={company.id}>
                <CompanyCard
                  company={company}
                  onClick={() => handleCompanyClick(company)}
                  isClickable={isAuthenticated}
                />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

