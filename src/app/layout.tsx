import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthProvider";
import { AntdProvider } from "@/components/AntdProvider";

export const metadata: Metadata = {
  title: "MeetupDay - B2B 매칭 플랫폼",
  description: "스타트업 간 협업, 밋업 일정 관리 및 기술적 지원을 제공하는 B2B 매칭 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <AntdProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen" style={{ background: '#ffffff' }}>
              {children}
            </main>
          </AuthProvider>
        </AntdProvider>
      </body>
    </html>
  );
}

