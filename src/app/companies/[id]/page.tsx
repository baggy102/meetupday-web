'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Company, Industry } from '@/types';
import { getCompanyById, getCurrentUser, canCreateMeetingRequest, incrementMonthlyRequestCount, createMeetingRequest, getCompanyByUserId } from '@/lib/api';
import { MeetingCalendar } from '@/components/MeetingCalendar';
import { Building2, Users, Code, Globe, Mail } from 'lucide-react';

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
      alert('사업자 인증이 필요합니다.');
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
      setError('최소 1개의 날짜를 선택해주세요.');
      return;
    }

    if (selectedDates.length > 3) {
      setError('최대 3개의 날짜만 선택 가능합니다.');
      return;
    }

    const user = getCurrentUser();
    if (!user || !company) return;

    // 사용자의 회사 찾기
    const userCompany = getCompanyByUserId(user.id);
    if (!userCompany) {
      setError('회사 등록이 필요합니다. 먼저 회사를 등록해주세요.');
      router.push('/companies/register');
      return;
    }

    createMeetingRequest(userCompany.id, company.id, selectedDates);
    incrementMonthlyRequestCount(user.id);
    
    alert('밋업 매칭 신청이 완료되었습니다.');
    router.push('/dashboard');
  };

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded">
              {company.industry}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">회사 소개</h2>
          <p className="text-gray-600 leading-relaxed">{company.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center text-gray-700">
            <Users className="w-5 h-5 mr-2 text-gray-500" />
            <span className="font-medium">회사 규모:</span>
            <span className="ml-2">{company.companySize}</span>
          </div>
          {company.website && (
            <div className="flex items-center text-gray-700">
              <Globe className="w-5 h-5 mr-2 text-gray-500" />
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                웹사이트 방문
              </a>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
            <Code className="w-5 h-5 mr-2" />
            대표 기술
          </h2>
          <div className="flex flex-wrap gap-2">
            {company.mainTechnologies.map((tech, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {showCalendar ? (
          <div className="mt-8 border-t pt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              밋업 일정 선택 (최대 3개)
            </h2>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            <MeetingCalendar
              selectedDates={selectedDates}
              onDatesChange={setSelectedDates}
              maxSelections={3}
            />
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleSubmitMeetingRequest}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                신청하기
              </button>
              <button
                onClick={() => {
                  setShowCalendar(false);
                  setSelectedDates([]);
                  setError('');
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 border-t pt-8">
            <button
              onClick={handleRequestMeeting}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              밋업 매칭 신청하기
            </button>
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

