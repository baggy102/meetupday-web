'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, logout } from '@/lib/api';
import { useEffect, useState } from 'react';
import { User } from '@/types';
import { Layout, Button, Space, Typography, Avatar, Input } from 'antd';
import { UserOutlined, LogoutOutlined, DashboardOutlined, PlusOutlined } from '@ant-design/icons';
import { useSearch } from './SearchContext';

const { Header } = Layout;
const { Text } = Typography;
const { Search } = Input;

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  // SearchContext는 선택적 (홈페이지가 아닐 때는 undefined일 수 있음)
  let searchContext;
  try {
    searchContext = useSearch();
  } catch {
    // SearchContext가 없을 때 (다른 페이지)
    searchContext = null;
  }
  
  const searchQuery = searchContext?.searchQuery || '';
  const setSearchQuery = searchContext?.setSearchQuery || (() => {});
  const onSearch = searchContext?.onSearch || (() => {});

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push('/');
  };

  const handleSearch = (value: string) => {
    onSearch(value);
  };

  return (
    <>
      <Header 
        style={{ 
          background: '#ffffff', 
          borderBottom: '1px solid #EAEAEA',
          padding: '0 24px',
          height: '64px',
          lineHeight: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.07)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        {/* 좌측: 로고 */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <Typography.Title 
            level={3} 
            style={{ 
              margin: 0, 
              color: '#2563EB',
              fontWeight: 700,
              fontSize: '26px',
              letterSpacing: '-1px',
            }}
          >
            MeetupDay
          </Typography.Title>
        </Link>

        {/* 중앙: 검색창 (홈페이지에서만 표시) */}
        {isHomePage && (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', maxWidth: '520px', margin: '0 40px' }}>
            <Search
              placeholder="회사명, 산업, 키워드로 검색"
              allowClear
              size="large"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={handleSearch}
              style={{
                width: '100%',
              }}
              styles={{
                input: {
                  borderRadius: '10px',
                  height: '40px',
                  lineHeight: '40px',
                },
                suffix: {
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                }
              }}
            />
          </div>
        )}

        {/* 우측: 액션 버튼들 */}
        <Space size={16} align="center">
          {user ? (
            <>
              <Button 
                type="link" 
                icon={<DashboardOutlined />}
                onClick={() => router.push('/dashboard')}
                style={{ fontWeight: 500, color: '#0F172A', padding: '0 8px' }}
              >
                대시보드
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => router.push('/companies/register')}
                style={{ fontWeight: 600, height: '40px' }}
              >
                회사 등록
              </Button>
              <Avatar 
                size={32} 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#2563EB', cursor: 'pointer' }}
                onClick={() => router.push('/dashboard')}
              />
              <Button 
                type="text" 
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{ fontWeight: 500, color: '#6B7280', padding: '0 8px' }}
              >
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button 
                type="text"
                onClick={() => router.push('/auth/login')}
                style={{ fontWeight: 500, color: '#0F172A', padding: '0 8px' }}
              >
                로그인
              </Button>
              <Button 
                type="primary"
                onClick={() => router.push('/auth/register')}
                style={{ fontWeight: 600, height: '40px' }}
              >
                회원가입
              </Button>
            </>
          )}
        </Space>
      </Header>
    </>
  );
}

