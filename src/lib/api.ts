import { User, Company, MeetingRequest, Notification, Industry } from '@/types';
import { mockUsers, mockCompanies, mockMeetingRequests, mockNotifications, mockMonthlyRequestCounts, initializeMockData } from './mockData';
import { getCurrentMonth } from './utils';

// 초기화
if (typeof window !== 'undefined') {
  initializeMockData();
}

// 인증 관련
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;
  const user = JSON.parse(userStr);
  // Date 객체 복원
  if (user.createdAt) {
    user.createdAt = new Date(user.createdAt);
  }
  return user;
}

export function setCurrentUser(user: User): void {
  if (typeof window === 'undefined') return;
  // mockUsers에 사용자 추가 (중복 체크)
  if (!mockUsers.find(u => u.id === user.id)) {
    mockUsers.push(user);
  }
  localStorage.setItem('currentUser', JSON.stringify(user));
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('currentUser');
}

// 회사 관련
export function getCompanies(): Company[] {
  return mockCompanies;
}

export function getCompanyById(id: string): Company | undefined {
  return mockCompanies.find(c => c.id === id);
}

export function getCompanyByUserId(userId: string): Company | undefined {
  return mockCompanies.find(c => c.userId === userId);
}

export function getUserById(userId: string): User | undefined {
  return mockUsers.find(u => u.id === userId);
}

export function createCompany(company: Omit<Company, 'id' | 'createdAt'>): Company {
  const newCompany: Company = {
    ...company,
    id: String(mockCompanies.length + 1),
    createdAt: new Date(),
  };
  mockCompanies.push(newCompany);
  return newCompany;
}

// 매칭 신청 관련
export function getMeetingRequests(userId: string): MeetingRequest[] {
  const user = getCurrentUser();
  if (!user) return [];
  
  const userCompany = mockCompanies.find(c => c.userId === userId);
  if (!userCompany) return [];

  return mockMeetingRequests
    .filter(
      req => req.fromCompanyId === userCompany.id || req.toCompanyId === userCompany.id
    )
    .map(req => ({
      ...req,
      selectedDates: req.selectedDates.map(d => d instanceof Date ? d : new Date(d)),
      createdAt: req.createdAt instanceof Date ? req.createdAt : new Date(req.createdAt),
      acceptedDate: req.acceptedDate ? (req.acceptedDate instanceof Date ? req.acceptedDate : new Date(req.acceptedDate)) : undefined,
    }));
}

export function createMeetingRequest(
  fromCompanyId: string,
  toCompanyId: string,
  selectedDates: Date[]
): MeetingRequest {
  const newRequest: MeetingRequest = {
    id: String(mockMeetingRequests.length + 1),
    fromCompanyId,
    toCompanyId,
    selectedDates,
    status: 'pending',
    createdAt: new Date(),
  };
  mockMeetingRequests.push(newRequest);

  // 알림 생성
  const toCompany = mockCompanies.find(c => c.id === toCompanyId);
  if (toCompany) {
    const fromCompany = mockCompanies.find(c => c.id === fromCompanyId);
    const notification: Notification = {
      id: String(mockNotifications.length + 1),
      userId: toCompany.userId,
      type: 'meeting_request',
      meetingRequestId: newRequest.id,
      message: `${fromCompany?.name || '회사'}에서 밋업 매칭을 신청했습니다.`,
      read: false,
      createdAt: new Date(),
    };
    mockNotifications.push(notification);
  }

  return newRequest;
}

export function acceptMeetingRequest(requestId: string, acceptedDate: Date): void {
  const request = mockMeetingRequests.find(r => r.id === requestId);
  if (request) {
    request.status = 'accepted';
    request.acceptedDate = acceptedDate;

    // 알림 생성
    const fromCompany = mockCompanies.find(c => c.id === request.fromCompanyId);
    if (fromCompany) {
      const notification: Notification = {
        id: String(mockNotifications.length + 1),
        userId: fromCompany.userId,
        type: 'meeting_accepted',
        meetingRequestId: requestId,
        message: `밋업 매칭이 수락되었습니다.`,
        read: false,
        createdAt: new Date(),
      };
      mockNotifications.push(notification);
    }
  }
}

export function rejectMeetingRequest(requestId: string): void {
  const request = mockMeetingRequests.find(r => r.id === requestId);
  if (request) {
    request.status = 'rejected';
  }
}

// 알림 관련
export function getNotifications(userId: string): Notification[] {
  return mockNotifications
    .filter(n => n.userId === userId)
    .map(n => ({
      ...n,
      createdAt: n.createdAt instanceof Date ? n.createdAt : new Date(n.createdAt),
    }))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function markNotificationAsRead(notificationId: string): void {
  const notification = mockNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
}

// 월별 신청 횟수 확인
export function getMonthlyRequestCount(userId: string): number {
  const month = getCurrentMonth();
  const key = `${userId}-${month}`;
  return mockMonthlyRequestCounts.get(key) || 0;
}

export function incrementMonthlyRequestCount(userId: string): void {
  const month = getCurrentMonth();
  const key = `${userId}-${month}`;
  const current = mockMonthlyRequestCounts.get(key) || 0;
  mockMonthlyRequestCounts.set(key, current + 1);
}

export function canCreateMeetingRequest(userId: string): boolean {
  return getMonthlyRequestCount(userId) < 5;
}

