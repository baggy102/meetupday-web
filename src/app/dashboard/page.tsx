'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getMeetingRequests, getNotifications, acceptMeetingRequest, rejectMeetingRequest, getCompanyById, getMonthlyRequestCount, getCompanyByUserId, getCompanies, markNotificationAsRead, getUserById } from '@/lib/api';
import { MeetingRequest, Notification, Company } from '@/types';
import { formatDate } from '@/lib/utils';
import { Bell, Calendar, Mail, Check, X } from 'lucide-react';
import { DatePickerModal } from '@/components/DatePickerModal';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(getCurrentUser());
  const [meetingRequests, setMeetingRequests] = useState<MeetingRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [companies, setCompanies] = useState<Map<string, Company>>(new Map());
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const requests = getMeetingRequests(user.id);
    setMeetingRequests(requests);

    const notifs = getNotifications(user.id);
    setNotifications(notifs);

    // 회사 정보 로드
    const allCompanies = getCompanies();
    const companyMap = new Map<string, Company>();
    requests.forEach(req => {
      if (!companyMap.has(req.fromCompanyId)) {
        const company = allCompanies.find(c => c.id === req.fromCompanyId);
        if (company) companyMap.set(req.fromCompanyId, company);
      }
      if (!companyMap.has(req.toCompanyId)) {
        const company = allCompanies.find(c => c.id === req.toCompanyId);
        if (company) companyMap.set(req.toCompanyId, company);
      }
    });
    setCompanies(companyMap);

    const count = getMonthlyRequestCount(user.id);
    setMonthlyCount(count);
  }, [user, router]);

  const handleAccept = (requestId: string, date: Date) => {
    acceptMeetingRequest(requestId, date);
    // 새로고침
    const requests = getMeetingRequests(user!.id);
    setMeetingRequests(requests);
    const notifs = getNotifications(user!.id);
    setNotifications(notifs);
  };

  const handleOpenDatePicker = (requestId: string) => {
    setSelectedRequestId(requestId);
    setShowDatePicker(true);
  };

  const handleDateSelect = (date: Date) => {
    if (selectedRequestId) {
      handleAccept(selectedRequestId, date);
      setSelectedRequestId(null);
    }
  };

  const handleReject = (requestId: string) => {
    if (confirm('정말 거절하시겠습니까?')) {
      rejectMeetingRequest(requestId);
      const requests = getMeetingRequests(user!.id);
      setMeetingRequests(requests);
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    const notifs = getNotifications(user!.id);
    setNotifications(notifs);
  };

  if (!user) {
    return null;
  }

  const pendingRequests = meetingRequests.filter(r => r.status === 'pending');
  const acceptedRequests = meetingRequests.filter(r => r.status === 'accepted');
  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">대시보드</h1>

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">이번 달 신청 횟수</p>
              <p className="text-2xl font-bold text-gray-900">{monthlyCount}/5</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">대기 중인 매칭</p>
              <p className="text-2xl font-bold text-gray-900">{pendingRequests.length}</p>
            </div>
            <Bell className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">수락된 매칭</p>
              <p className="text-2xl font-bold text-gray-900">{acceptedRequests.length}</p>
            </div>
            <Check className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* 알림 */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            알림
            {unreadNotifications.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {unreadNotifications.length}
              </span>
            )}
          </h2>
        </div>
        <div className="p-6">
          {notifications.length === 0 ? (
            <p className="text-gray-500">알림이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.read
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{notification.message}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        읽음
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 매칭 요청 관리 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            매칭 요청 관리
          </h2>
        </div>
        <div className="p-6">
          {meetingRequests.length === 0 ? (
            <p className="text-gray-500">매칭 요청이 없습니다.</p>
          ) : (
            <div className="space-y-6">
              {/* 받은 요청 (대기 중) */}
              {pendingRequests
                .filter(r => {
                  const userCompany = getCompanyByUserId(user.id);
                  return userCompany && r.toCompanyId === userCompany.id;
                })
                .map((request) => {
                  const fromCompany = companies.get(request.fromCompanyId);
                  return (
                    <div
                      key={request.id}
                      className="border border-gray-200 rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {fromCompany?.name || '알 수 없음'}에서 매칭 신청
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            신청일: {formatDate(request.createdAt)}
                          </p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          대기 중
                        </span>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          선택된 날짜:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {request.selectedDates.map((date, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded"
                            >
                              {formatDate(date)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <button
                          onClick={() => handleOpenDatePicker(request.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors mr-2 flex items-center"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          수락
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center"
                        >
                          <X className="w-4 h-4 mr-1" />
                          거절
                        </button>
                      </div>

                      <button
                        onClick={() => router.push(`/companies/${request.fromCompanyId}`)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        회사 정보 보기 →
                      </button>
                    </div>
                  );
                })}

              {/* 수락된 매칭 */}
              {acceptedRequests.map((request) => {
                const userCompany = getCompanyByUserId(user.id);
                const otherCompany = companies.get(
                  request.fromCompanyId === userCompany?.id
                    ? request.toCompanyId
                    : request.fromCompanyId
                );
                return (
                  <div
                    key={request.id}
                    className="border border-green-200 bg-green-50 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {otherCompany?.name || '알 수 없음'}와의 밋업
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          수락일: {request.acceptedDate && formatDate(request.acceptedDate)}
                        </p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        수락됨
                      </span>
                    </div>

                    {otherCompany && (() => {
                      const otherUser = getUserById(otherCompany.userId);
                      const email = otherUser?.email || `${otherCompany.userId}@example.com`;
                      return (
                        <div className="mt-4 p-4 bg-white rounded border border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            담당자 연락처:
                          </p>
                          <div className="flex items-center text-blue-600">
                            <Mail className="w-4 h-4 mr-2" />
                            <a
                              href={`mailto:${email}`}
                              className="hover:underline"
                            >
                              {email}
                            </a>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showDatePicker && selectedRequestId && (() => {
        const request = meetingRequests.find(r => r.id === selectedRequestId);
        return (
          <DatePickerModal
            isOpen={showDatePicker}
            onClose={() => {
              setShowDatePicker(false);
              setSelectedRequestId(null);
            }}
            onSelect={handleDateSelect}
            selectedDates={request?.selectedDates || []}
          />
        );
      })()}
    </div>
  );
}

