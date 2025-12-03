'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setCurrentUser } from '@/lib/api';
import { User } from '@/types';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    companyName: '',
    businessRegistrationNumber: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 사업자등록번호 검증 (간단한 형식 체크)
    const businessRegPattern = /^\d{3}-\d{2}-\d{5}$/;
    if (!businessRegPattern.test(formData.businessRegistrationNumber)) {
      setError('사업자등록번호 형식이 올바르지 않습니다. (예: 123-45-67890)');
      return;
    }

    // 실제로는 서버에서 사업자등록번호 인증을 해야 함
    const newUser: User = {
      id: String(Date.now()),
      email: formData.email,
      name: formData.name,
      companyName: formData.companyName,
      businessRegistrationNumber: formData.businessRegistrationNumber,
      isVerified: true, // 실제로는 인증 프로세스 후 true로 설정
      createdAt: new Date(),
    };

    setCurrentUser(newUser);
    router.push('/companies/register');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            회원가입
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            사업자등록 인증이 필요합니다
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                이름
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                회사명
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="businessRegistrationNumber" className="block text-sm font-medium text-gray-700">
                사업자등록번호
              </label>
              <input
                id="businessRegistrationNumber"
                name="businessRegistrationNumber"
                type="text"
                required
                placeholder="123-45-67890"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.businessRegistrationNumber}
                onChange={handleChange}
              />
              <p className="mt-1 text-xs text-gray-500">
                형식: 123-45-67890
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              회원가입
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-blue-600 hover:text-blue-500"
            >
              이미 계정이 있으신가요? 로그인
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

