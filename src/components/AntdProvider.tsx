'use client';

import { ConfigProvider } from 'antd';
import { ReactNode } from 'react';

interface AntdProviderProps {
  children: ReactNode;
}

export function AntdProvider({ children }: AntdProviderProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2563eb', // 메인 블루 컬러
          colorSuccess: '#10b981',
          colorWarning: '#f9c846', // 포인트 오렌지/옐로
          colorError: '#ef4444',
          colorInfo: '#2563eb',
          borderRadius: 8,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
        },
        components: {
          Button: {
            borderRadius: 8,
            controlHeight: 40,
          },
          Card: {
            borderRadius: 12,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          },
          Input: {
            borderRadius: 8,
            controlHeight: 40,
          },
          Select: {
            borderRadius: 8,
            controlHeight: 40,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

