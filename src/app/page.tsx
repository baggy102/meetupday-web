'use client';

import { useEffect, useState, useMemo } from 'react';
import CompanyCard from '@/components/CompanyCard';
import { FilterBar } from '@/components/FilterBar';
import { Company, Industry } from '@/types';
import { getCompanies, initializeMockData, getCurrentUser } from '@/lib/mockData';
import { useRouter } from 'next/navigation';
import { Typography, Empty, Space, Tag, Select, Pagination, Button } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import { useSearch } from '@/components/SearchContext';

const { Title } = Typography;

type SortOption = 'latest' | 'popular' | 'meeting-available';

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<Industry[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const { searchQuery } = useSearch();
  const [sortOption, setSortOption] = useState<SortOption>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const router = useRouter();

  const pageSize = 12;

  useEffect(() => {
    initializeMockData();
    const user = getCurrentUser();
    setIsAuthenticated(user?.isVerified || false);
    const data = getCompanies();
    setCompanies(data);
  }, []);

  // 검색 쿼리 변경 시 페이지 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // 필터링 및 검색
  const filtered = useMemo(() => {
    let result = [...companies];

    // 산업 필터
    if (selectedIndustries.length > 0) {
      result = result.filter(c => selectedIndustries.includes(c.industry));
    }

    // 검색어 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.industry.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.mainTechnologies.some(tech => tech.toLowerCase().includes(query))
      );
    }

    // 정렬
    switch (sortOption) {
      case 'latest':
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'popular':
        // 관심 많은순 (임시로 랜덤)
        result.sort(() => Math.random() - 0.5);
        break;
      case 'meeting-available':
        // 밋업 가능순 (임시로 랜덤)
        result.sort(() => Math.random() - 0.5);
        break;
    }

    return result;
  }, [companies, selectedIndustries, searchQuery, sortOption]);

  // 필터 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedIndustries, selectedRegions, selectedStages, selectedSizes, searchQuery, sortOption]);

  // 페이지네이션
  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  useEffect(() => {
    setFilteredCompanies(paginatedCompanies);
  }, [paginatedCompanies]);

  const handleCompanyClick = (company: Company) => {
    if (!isAuthenticated) {
      alert('회사 정보를 보려면 사업자 인증이 필요합니다. 로그인 후 회원가입을 완료해주세요.');
      router.push('/auth/login');
      return;
    }
    router.push(`/companies/${company.id}`);
  };

  const handleFavoriteToggle = (companyId: string, isFavorite: boolean) => {
    const newFavorites = new Set(favorites);
    if (isFavorite) {
      newFavorites.add(companyId);
    } else {
      newFavorites.delete(companyId);
    }
    setFavorites(newFavorites);
  };

  const removeFilter = (type: 'industry' | 'region' | 'stage' | 'size', value: string) => {
    switch (type) {
      case 'industry':
        setSelectedIndustries(selectedIndustries.filter(i => i !== value));
        break;
      case 'region':
        setSelectedRegions(selectedRegions.filter(r => r !== value));
        break;
      case 'stage':
        setSelectedStages(selectedStages.filter(s => s !== value));
        break;
      case 'size':
        setSelectedSizes(selectedSizes.filter(s => s !== value));
        break;
    }
  };

  const activeFilters = [
    ...selectedIndustries.map(i => ({ type: 'industry' as const, value: i, label: i })),
    ...selectedRegions.map(r => ({ type: 'region' as const, value: r, label: r })),
    ...selectedStages.map(s => ({ type: 'stage' as const, value: s, label: s })),
    ...selectedSizes.map(s => ({ type: 'size' as const, value: s, label: s })),
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 600);
      setIsTablet(width <= 1024 && width > 600);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 64px)',
      background: '#F8FAFC',
      padding: isMobile ? '24px 16px' : '32px 24px',
    }}>
      {/* 상단 필터 바 */}
      <FilterBar
        selectedIndustries={selectedIndustries}
        onIndustriesChange={setSelectedIndustries}
        selectedRegions={selectedRegions}
        onRegionsChange={setSelectedRegions}
        selectedStages={selectedStages}
        onStagesChange={setSelectedStages}
        selectedSizes={selectedSizes}
        onSizesChange={setSelectedSizes}
      />

      {/* 상단: 정렬 및 필터 태그 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Title level={2} style={{ 
            margin: 0,
            marginBottom: '16px',
            fontSize: isMobile ? '20px' : '24px', 
            fontWeight: 600, 
            color: '#0F172A',
          }}>
            회사 탐색 ({filtered.length})
          </Title>
          
          {/* 활성 필터 pills */}
          {activeFilters.length > 0 && (
            <Space wrap size={8} style={{ marginBottom: '12px' }}>
              {activeFilters.map((filter, index) => (
                <Tag
                  key={`${filter.type}-${filter.value}-${index}`}
                  closable
                  onClose={() => removeFilter(filter.type, filter.value)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '16px',
                    background: '#F5F5F5',
                    color: '#0F172A',
                    border: '1px solid #EAEAEA',
                    fontSize: '13px',
                  }}
                >
                  {filter.label}
                </Tag>
              ))}
            </Space>
          )}
        </div>

        <Select
          value={sortOption}
          onChange={setSortOption}
          style={{ width: isMobile ? '100%' : 180, height: '40px' }}
          options={[
            { label: '최신 등록순', value: 'latest' },
            { label: '관심 많은순', value: 'popular' },
            { label: '밋업 가능순', value: 'meeting-available' },
          ]}
        />
      </div>

      {/* 회사 카드 그리드 */}
      {filtered.length === 0 ? (
        <Empty 
          description="조건에 맞는 회사가 없습니다." 
          style={{ padding: '80px 0' }}
        />
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile 
              ? '1fr' 
              : isTablet
                ? 'repeat(2, 1fr)' 
                : 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '32px',
          }}>
            {filteredCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onClick={() => handleCompanyClick(company)}
                isClickable={isAuthenticated}
                isFavorite={favorites.has(company.id)}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>

          {/* 페이지네이션 */}
          {filtered.length > pageSize && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginTop: '40px',
              marginBottom: '20px',
            }}>
              <Pagination
                current={currentPage}
                total={filtered.length}
                pageSize={pageSize}
                onChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                showSizeChanger={false}
                showQuickJumper
              />
            </div>
          )}
        </>
      )}

      {/* 위로가기 버튼 (모바일) */}
      {(isMobile || isTablet) && (
        <Button
          type="primary"
          shape="circle"
          icon={<UpOutlined />}
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '48px',
            height: '48px',
            zIndex: 100,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        />
      )}
    </div>
  );
}

