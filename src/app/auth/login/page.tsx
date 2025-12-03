'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, setCurrentUser } from '@/lib/api';
import { User } from '@/types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 간단한 로그인 로직 (실제로는 서버 인증 필요)
    // 여기서는 mock 데이터로 처리
    const mockUser: User = {
      id: '1',
      email,
      name: '테스트 사용자',
      companyName: '테스트 회사',
      businessRegistrationNumber: '123-45-67890',
      isVerified: true,
      createdAt: new Date(),
    };

    if (email && password) {
      setCurrentUser(mockUser);
      router.push('/dashboard'); // 로그인 후 바로 대시보드로 이동
    } else {
      setError('이메일과 비밀번호를 입력해주세요.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            로그인
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              로그인
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/register"
              className="text-blue-600 hover:text-blue-500"
            >
              계정이 없으신가요? 회원가입
            </Link>
          </div>
        </form>
        {/* 대시보드 바로가기 안내 추가 */}
        <div className="text-center pt-4">
          <Link
            href="/dashboard"
            className="text-blue-500 font-semibold hover:underline rounded px-4 py-2 inline-block border border-blue-200"
          >
            🔒 로그인 후 대시보드에서 내 밋업을 관리하세요
          </Link>
        </div>
      </div>
    </div>
  );
}

