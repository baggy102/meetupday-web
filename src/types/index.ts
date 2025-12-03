export type Industry = 'IT' | '마케팅' | '헬스케어' | 'AI';

export interface User {
  id: string;
  email: string;
  name: string;
  companyName: string;
  businessRegistrationNumber: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface Company {
  id: string;
  userId: string;
  name: string;
  industry: Industry;
  description: string;
  mainTechnologies: string[];
  companySize: string;
  website?: string;
  logo?: string;
  createdAt: Date;
}

export interface MeetingRequest {
  id: string;
  fromCompanyId: string;
  toCompanyId: string;
  selectedDates: Date[];
  status: 'pending' | 'accepted' | 'rejected';
  acceptedDate?: Date;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'meeting_request' | 'meeting_accepted' | 'meeting_rejected';
  meetingRequestId?: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface MonthlyRequestCount {
  userId: string;
  month: string; // YYYY-MM format
  count: number;
}

