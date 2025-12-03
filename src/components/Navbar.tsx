'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout } from '@/lib/api';
import { useEffect, useState } from 'react';
import { User } from '@/types';
import { Layout, Menu, Button, Space, Typography, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, DashboardOutlined, PlusOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Text } = Typography;

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
    <Header 
      style={{ 
        background: '#ffffff', 
        borderBottom: '1px solid #e5e7eb',
        padding: '0 24px',
        height: '64px',
        lineHeight: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.07)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <Link href="/" style={{ textDecoration: 'none' }}>
        <Typography.Title 
          level={3} 
          style={{ 
            margin: 0, 
            color: '#2563eb',
            fontWeight: 700,
            fontSize: '24px',
            letterSpacing: '-1px',
          }}
        >
          MeetupDay
        </Typography.Title>
      </Link>

      <Space size={24} align="center">
        {user ? (
          <>
            <Button 
              type="link" 
              icon={<DashboardOutlined style={{color:'#155cc8'}}/>}
              onClick={() => router.push('/dashboard')}
              style={{fontWeight:'bold',color:'#2563eb'}}
              size="large"
            >
              대시보드
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => router.push('/companies/register')}
              style={{fontWeight:'bold'}}
              size="large"
            >
              회사 등록
            </Button>
            <Space size={12}>
              <Avatar size={32} icon={<UserOutlined />} style={{ backgroundColor:'#2563eb', fontWeight:'bold'}} />
              <Text style={{fontWeight:600, color:'#374151'}}>{user.companyName || user.name}</Text>
            </Space>
            <Button 
              type="default" 
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{fontWeight:'bold',color:'#EF4444'}}
              size="large"
            >
              로그아웃
            </Button>
          </>
        ) : (
          <>
            <Button 
              type="primary"
              onClick={() => router.push('/auth/login')}
              style={{ fontWeight:'bold', minWidth:120, fontSize:17 }}
              size="large"
            >
              로그인
            </Button>
            <Button 
              type="text"
              onClick={() => router.push('/auth/register')}
              style={{ color:'#2563eb',fontWeight:'bold',minWidth:120,fontSize:17,border:'none' }}
              size="large"
            >
              회원가입
            </Button>
          </>
        )}
      </Space>
    </Header>
  );
}

