import { useState, useEffect, useCallback } from 'react';

import alert from '@/api/alert';
import { useIsEmployee } from '@/hooks/useCheckUserType';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * 알림 데이터 타입
 * NotificationModal 컴포넌트에서 사용하는 형식
 */
export interface Notification {
  id: string;
  shopName: string;
  status: 'accepted' | 'rejected';
  time: string;
  read: boolean;
}

// useNotifications 훅 옵션 타입
interface UseNotificationsOptions {
  pollingInterval?: number; // 알림 조회 주기 (밀리초), 기본값: 60000ms (1분)
  enabled?: boolean; // 알림 기능 활성화 여부, 기본값: true
}

const getWorkTime = (startAt: string, durationHours: number) => {
  const startDate = new Date(startAt);

  // 종료 시간 계산
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + durationHours);

  // 날짜 포맷
  const pad = (n: number) => n.toString().padStart(2, '0');
  const dateStr = `${startDate.getFullYear()}-${pad(startDate.getMonth() + 1)}-${pad(startDate.getDate())}`;
  const startTimeStr = `${pad(startDate.getHours())}:${pad(startDate.getMinutes())}`;
  const endTimeStr = `${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`;

  const text = `${dateStr} ${startTimeStr}~${endTimeStr}`;

  return text;
};

/**
 * 알림 관리 커스텀 훅
 *
 * 직원(Employee) 사용자의 알림을 관리합니다.
 * - 주기적으로 알림 데이터를 조회 (폴링)
 * - 읽지 않은 알림 존재 여부 확인
 * - 알림 Modal 열기/닫기 상태 관리
 *
 * @param options - 훅 설정 옵션
 * @param options.pollingInterval - 알림 조회 주기 (기본값: 60000ms)
 * @param options.enabled - 알림 기능 활성화 여부 (기본값: true)
 *
 * @returns {Object} 알림 관련 상태 및 액션 함수
 */
export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const { pollingInterval = 60000, enabled = true } = options;

  // 인증 스토어에서 사용자 정보 가져오기
  const { user } = useAuthStore();
  // 현재 사용자가 직원(알바)인지 확인
  const isEmployee = useIsEmployee();

  // 알림 Modal 열림/닫힘 상태
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // 알림 목록
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 읽지 않은 알림 존재 여부
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  // 알림 조회 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 알림 조회 에러 상태
  const [error, setError] = useState<Error | null>(null);

  /**
   * 서버에서 알림 데이터를 조회하고 상태를 업데이트합니다.
   *
   * 조건:
   * - enabled가 true여야 함
   * - 사용자가 직원(Employee)이어야 함
   * - userId가 존재해야 함
   *
   * 처리 과정:
   * 1. API를 통해 알림 목록 조회
   * 2. 알림 데이터를 NotificationModal 형식으로 변환
   * 3. 읽지 않은 알림 존재 여부 확인
   * 4. 상태 업데이트
   */
  const fetchNotifications = useCallback(async () => {
    // 조건 체크: 기능 비활성화, 직원 아님, 사용자 ID 없음, 로딩 중
    if (!enabled || !isEmployee || !user?.id || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // 알림 API 호출
      const response = await alert.getAlerts(user.id);

      // API 응답 데이터를 UI에서 사용하는 형식으로 변환
      // status가 'accepted' 또는 'rejected'인 항목만 필터링
      const formattedNotifications = response.items
        .filter((alertItem) => {
          const status = alertItem.item.result;
          return status === 'accepted' || status === 'rejected';
        })
        .map((alertItem) => {
          return {
            id: alertItem.item.id,
            shopName: alertItem.item.shop.item.name, // 가게 이름
            status: alertItem.item.result, // 'accepted' | 'rejected'
            time: getWorkTime(
              alertItem.item.notice.item.startsAt,
              alertItem.item.notice.item.workhour
            ), // 예: 2023-01-14 15:00~18:00
            read: alertItem.item.read, // 읽음 여부
          };
        });

      setNotifications(formattedNotifications);

      // 읽지 않은 알림이 하나라도 있는지 확인
      const hasUnread = response.items.some(
        (alertItem) => !alertItem.item.read
      );
      setHasUnreadNotifications(hasUnread);
    } catch (err) {
      // 에러 처리
      const error = err instanceof Error ? err : new Error('알림 조회 실패');
      setError(error);
      console.error('알림 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, isEmployee, user?.id, isLoading]);

  /**
   * 직원 사용자일 때 주기적으로 알림 데이터를 조회합니다.
   *
   * - 컴포넌트 마운트 시 즉시 조회
   * - pollingInterval 간격으로 반복 조회
   * - 컴포넌트 언마운트 시 인터벌 정리
   */
  useEffect(() => {
    if (!enabled || !isEmployee || !user?.id) return;

    // 초기 조회 (즉시 실행)
    fetchNotifications();

    // 주기적으로 조회 (폴링)
    const intervalId = setInterval(fetchNotifications, pollingInterval);

    // cleanup: 컴포넌트 언마운트 시 인터벌 제거
    return () => clearInterval(intervalId);
  }, [enabled, isEmployee, user?.id, pollingInterval, fetchNotifications]);

  /**
   * 알림을 읽음 처리하고 알림 목록을 다시 조회합니다.
   *
   * @param notificationId - 읽음 처리할 알림 ID
   */
  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (!user?.id) return;

      try {
        // 알림 읽음 처리 API 호출
        await alert.readAlert(user?.id, notificationId);

        // 알림 목록 재조회
        await fetchNotifications();
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('알림 읽음 처리 실패');
        console.error('알림 읽음 처리 실패:', error);
        setError(error);
      }
    },
    [user?.id, fetchNotifications]
  );

  // 알림 Modal 토글
  const toggleNotification = useCallback(() => {
    setIsNotificationOpen((prev) => !prev);
  }, []);

  // 알림 Modal 닫기
  const closeNotification = useCallback(() => {
    setIsNotificationOpen(false);
  }, []);

  // 알림 Modal 열기
  const openNotification = useCallback(() => {
    setIsNotificationOpen(true);
  }, []);

  return {
    // 상태
    isNotificationOpen, // Modal 열림/닫힘 상태
    notifications, // 알림 목록
    hasUnreadNotifications, // 읽지 않은 알림 존재 여부
    isLoading, // 로딩 상태
    error, // 에러 상태

    // 액션
    toggleNotification, // Modal 토글
    closeNotification, // Modal 닫기
    openNotification, // Modal 열기
    fetchNotifications, // 수동 새로고침 (필요시 사용)
    markAsRead, // 알림 읽음 처리
  };
};
