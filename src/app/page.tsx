'use client';

import { useEffect, useState } from 'react';
import { CompanyCard } from '@/components/CompanyCard';
import { IndustryFilter } from '@/components/IndustryFilter';
import { Company, Industry } from '@/types';
import { getCompanies, getCurrentUser } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | 'all'>('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 인증 상태 확인
    const user = getCurrentUser();
    setIsAuthenticated(user?.isVerified || false);

    // 회사 목록 로드
    const loadCompanies = async () => {
      const data = getCompanies();
      setCompanies(data);
      setFilteredCompanies(data);
    };

    loadCompanies();
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          MeetupDay
        </h1>
        <p className="text-lg text-gray-600">
          스타트업 간 협업과 밋업을 위한 B2B 매칭 플랫폼
        </p>
      </div>

      <IndustryFilter
        selectedIndustry={selectedIndustry}
        onIndustryChange={setSelectedIndustry}
      />

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {selectedIndustry === 'all' ? '전체 회사' : `${selectedIndustry} 회사`} ({filteredCompanies.length})
        </h2>

        {filteredCompanies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">등록된 회사가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onClick={() => handleCompanyClick(company)}
                isClickable={isAuthenticated}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

