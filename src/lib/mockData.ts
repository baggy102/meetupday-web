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
      {
        id: '1',
        userId: 'user1',
        name: '테크스타트업',
        industry: 'IT',
        description: '혁신적인 IT 솔루션을 제공하는 스타트업입니다.',
        mainTechnologies: ['React', 'Node.js', 'TypeScript'],
        companySize: '10-50명',
        website: 'https://example.com',
        createdAt: new Date(),
      },
      {
        id: '2',
        userId: 'user2',
        name: '마케팅 에이전시',
        industry: '마케팅',
        description: '디지털 마케팅 전문 에이전시입니다.',
        mainTechnologies: ['SEO', 'SNS 마케팅', '콘텐츠 마케팅'],
        companySize: '5-20명',
        createdAt: new Date(),
      },
      {
        id: '3',
        userId: 'user3',
        name: '헬스케어 솔루션',
        industry: '헬스케어',
        description: '헬스케어 IT 솔루션을 개발합니다.',
        mainTechnologies: ['IoT', '빅데이터', 'AI'],
        companySize: '20-100명',
        createdAt: new Date(),
      },
      {
        id: '4',
        userId: 'user4',
        name: 'AI 연구소',
        industry: 'AI',
        description: '인공지능 기술 연구 및 개발을 진행합니다.',
        mainTechnologies: ['머신러닝', '딥러닝', 'NLP'],
        companySize: '50-200명',
        createdAt: new Date(),
      }
    );
  }
}

