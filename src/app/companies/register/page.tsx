'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, createCompany } from '@/lib/api';
import { Industry } from '@/types';

const industries: Industry[] = ['IT', '마케팅', '헬스케어', 'AI'];

export default function RegisterCompanyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    industry: '' as Industry | '',
    description: '',
    mainTechnologies: '',
    companySize: '',
    website: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = getCurrentUser();
    if (!user || !user.isVerified) {
      setError('사업자 인증이 필요합니다.');
      return;
    }

    if (!formData.name || !formData.industry || !formData.description) {
      setError('필수 항목을 모두 입력해주세요.');
      return;
    }

    const technologies = formData.mainTechnologies
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const company = createCompany({
      userId: user.id,
      name: formData.name,
      industry: formData.industry as Industry,
      description: formData.description,
      mainTechnologies: technologies,
      companySize: formData.companySize,
      website: formData.website || undefined,
    });

    alert('회사 등록이 완료되었습니다.');
    router.push(`/companies/${company.id}`);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">회사 등록</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              회사명 <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
              산업 분야 <span className="text-red-500">*</span>
            </label>
            <select
              id="industry"
              name="industry"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.industry}
              onChange={handleChange}
            >
              <option value="">선택해주세요</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              회사 소개 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="mainTechnologies" className="block text-sm font-medium text-gray-700 mb-2">
              대표 기술
            </label>
            <input
              id="mainTechnologies"
              name="mainTechnologies"
              type="text"
              placeholder="예: React, Node.js, TypeScript (쉼표로 구분)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.mainTechnologies}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-2">
              회사 규모
            </label>
            <input
              id="companySize"
              name="companySize"
              type="text"
              placeholder="예: 10-50명"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.companySize}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
              웹사이트
            </label>
            <input
              id="website"
              name="website"
              type="url"
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              등록하기
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

