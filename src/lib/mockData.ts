import { Company, User, MeetingRequest, Notification, Industry } from '@/types';

// Mock 데이터 저장소 (실제로는 데이터베이스를 사용해야 함)
export const mockUsers: User[] = [];
export const mockCompanies: Company[] = [];
export const mockMeetingRequests: MeetingRequest[] = [];
export const mockNotifications: Notification[] = [];
export const mockMonthlyRequestCounts: Map<string, number> = new Map();

// 초기 샘플 데이터
export function initializeMockData() {
  if (mockCompanies.length === 0) {
    mockCompanies.push(
      // IT
      {
        id: 'it-1', userId: 'user-it-1', name: '코드마이스터', industry: 'IT', description: '최고의 개발 전문가들이 모인 IT 기업', mainTechnologies: ['React', 'TypeScript', 'AWS'], companySize: '10-30명', website: 'https://codemeister.io', createdAt: new Date() },
      { id: 'it-2', userId: 'user-it-2', name: '디지털브릿지', industry: 'IT', description: '디지털 솔루션 통합 서비스', mainTechnologies: ['Node.js', 'Next.js', 'Kubernetes'], companySize: '30-70명', website: 'https://digitalbridge.com', createdAt: new Date() },
      { id: 'it-3', userId: 'user-it-3', name: '누리소프트', industry: 'IT', description: '클라우드 네이티브 서비스 전문', mainTechnologies: ['GCP', 'Python', 'Docker'], companySize: '15-40명', website: 'https://nuri.co.kr', createdAt: new Date() },
      { id: 'it-4', userId: 'user-it-4', name: '모바일팩토리', industry: 'IT', description: '모바일 앱 기획&개발 전문팀', mainTechnologies: ['Flutter', 'Firebase', 'Java'], companySize: '20-80명', website: 'https://mobilefactory.dev', createdAt: new Date() },
      { id: 'it-5', userId: 'user-it-5', name: '에이아이런치', industry: 'IT', description: 'AI 기반 플랫폼 구축 선두주자', mainTechnologies: ['AI', 'TensorFlow', 'Go'], companySize: '10-60명', website: 'https://ailaunch.com', createdAt: new Date() },
      // 마케팅
      { id: 'marketing-1', userId: 'user-marketing-1', name: '위드마케팅', industry: '마케팅', description: '브랜드 성장과 퍼포먼스 마케팅 전략에 강점', mainTechnologies: ['SEO', 'Google Ads', 'GA4'], companySize: '5-28명', website: 'https://withmarketing.net', createdAt: new Date() },
      { id: 'marketing-2', userId: 'user-marketing-2', name: 'SNS파인더', industry: '마케팅', description: 'SNS 기반 바이럴 마케팅 전문', mainTechnologies: ['Instagram', 'YouTube', 'Viral'], companySize: '10-35명', website: 'https://snsfinder.com', createdAt: new Date() },
      { id: 'marketing-3', userId: 'user-marketing-3', name: '콘텐츠리더', industry: '마케팅', description: '콘텐츠 제작과 마케팅의 혁신을 선도', mainTechnologies: ['Content Studio', 'Blog', 'Shorts'], companySize: '8-25명', website: 'https://contentleader.kr', createdAt: new Date() },
      { id: 'marketing-4', userId: 'user-marketing-4', name: '모비인사이트', industry: '마케팅', description: '모바일 게임/앱 홍보 마케팅 전문', mainTechnologies: ['App Promotion', 'Data Analysis'], companySize: '18-45명', website: 'https://mobinsight.com', createdAt: new Date() },
      { id: 'marketing-5', userId: 'user-marketing-5', name: '에듀마케팅', industry: '마케팅', description: '교육 분야 No.1 온오프 융합마케팅 그룹', mainTechnologies: ['Edtech', 'Offline Event', 'Email'], companySize: '7-19명', website: 'https://edumarketer.co.kr', createdAt: new Date() },
      // 헬스케어
      { id: 'health-1', userId: 'user-health-1', name: '메디케어랩', industry: '헬스케어', description: '디지털 헬스케어의 미래를 이끕니다', mainTechnologies: ['IoT', '블루투스', 'Wearable'], companySize: '12-50명', website: 'https://medicarelab.com', createdAt: new Date() },
      { id: 'health-2', userId: 'user-health-2', name: '닥터헬스', industry: '헬스케어', description: 'AI 맞춤 건강관리 플랫폼 제공', mainTechnologies: ['AI', 'App', 'Bio'], companySize: '20-80명', website: 'https://drhealth.ai', createdAt: new Date() },
      { id: 'health-3', userId: 'user-health-3', name: '웰케어랩스', industry: '헬스케어', description: '혁신 웰니스 디바이스 제조', mainTechnologies: ['Hardware', 'Arduino', 'BigData'], companySize: '25-55명', website: 'https://wellcarelabs.net', createdAt: new Date() },
      { id: 'health-4', userId: 'user-health-4', name: '헬스라인', industry: '헬스케어', description: 'B2B 예방의학 솔루션 기업', mainTechnologies: ['Prevention', 'SaaS', 'Enterprise'], companySize: '10-22명', website: 'https://healthlineb2b.com', createdAt: new Date() },
      { id: 'health-5', userId: 'user-health-5', name: '실버케어', industry: '헬스케어', description: '고령친화 서비스 및 돌봄 프로젝트 운영', mainTechnologies: ['SeniorCare', 'App', 'Kiosk'], companySize: '13-38명', website: 'https://silvercare.or.kr', createdAt: new Date() },
      // AI
      { id: 'ai-1', userId: 'user-ai-1', name: '네오AI테크', industry: 'AI', description: '초거대언어 모델 개발 혁신 기업', mainTechnologies: ['GPT', 'Python', 'API'], companySize: '30-120명', website: 'https://neoai.tech', createdAt: new Date() },
      { id: 'ai-2', userId: 'user-ai-2', name: '엑셀리언트', industry: 'AI', description: '스마트 팩토리 AI 솔루션 전문', mainTechnologies: ['AIoT', 'PLC', 'Factory'], companySize: '18-55명', website: 'https://excellentai.com', createdAt: new Date() },
      { id: 'ai-3', userId: 'user-ai-3', name: '딥러닝로직', industry: 'AI', description: '딥러닝 기반 영상AI 연구팀', mainTechnologies: ['YOLO', 'CV', 'CUDA'], companySize: '14-29명', website: 'https://deeplearnlogic.co.kr', createdAt: new Date() },
      { id: 'ai-4', userId: 'user-ai-4', name: '스피치넥스트', industry: 'AI', description: '음성 인식 AI 솔루션/모듈 개발', mainTechnologies: ['STT', 'Speech', 'Korean'], companySize: '9-24명', website: 'https://speechnext.ai', createdAt: new Date() },
      { id: 'ai-5', userId: 'user-ai-5', name: '에듀AI랩', industry: 'AI', description: '에듀테크와 AI융합 학습 콘텐츠 연구', mainTechnologies: ['Edutech', 'GenAI', 'Vision'], companySize: '11-42명', website: 'https://eduailab.com', createdAt: new Date() },
    );
  }
}

export function getCompanies() {
  // 데이터가 없으면 자동으로 초기화
  if (mockCompanies.length === 0) {
    initializeMockData();
  }
  return mockCompanies;
}

export function getCurrentUser() {
  return { isVerified: true };
}

