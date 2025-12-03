'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout } from '@/lib/api';
import { useEffect, useState } from 'react';
import { User } from '@/types';

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            MeetupDay
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  대시보드
                </Link>
                <Link
                  href="/companies/register"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  회사 등록
                </Link>
                <span className="text-gray-700">
                  {user.companyName || user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  로그인
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

