import { useState, useEffect, useCallback, useRef } from 'react';

import alert from '@/apis/alert';
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

/**
 * useNotifications 훅 옵션 타입
 */
interface UseNotificationsOptions {
  /** 알림 조회 주기 (밀리초), 기본값: 60000ms (1분) */
  pollingInterval?: number;
  /** 알림 기능 활성화 여부, 기본값: true */
  enabled?: boolean;
  /** 페이지 가시성 감지 활성화 여부, 기본값: true */
  respectVisibility?: boolean;
}

const getWorkTime = (startAt: string, durationHours: number) => {
  const startDate = new Date(startAt);
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + durationHours);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const dateStr = `${startDate.getFullYear()}-${pad(startDate.getMonth() + 1)}-${pad(startDate.getDate())}`;
  const startTimeStr = `${pad(startDate.getHours())}:${pad(startDate.getMinutes())}`;
  const endTimeStr = `${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`;

  return `${dateStr} ${startTimeStr}~${endTimeStr}`;
};

/**
 * 페이지 가시성을 감지하는 훅
 */
const usePageVisibility = (enabled: boolean) => {
  const [isPageVisible, setIsPageVisible] = useState(true);

  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled]);

  return isPageVisible;
};

/**
 * 알림 관리 통합 커스텀 훅
 *
 * 직원(Employee) 사용자의 알림을 관리합니다.
 * - 주기적으로 알림 데이터를 조회 (폴링)
 * - 읽지 않은 알림 존재 여부 확인
 * - 알림 Modal 열기/닫기 상태 관리
 * - 페이지 가시성 고려 (선택적)
 *
 * @param options - 훅 설정 옵션
 * @returns 알림 관련 상태 및 액션 함수
 *
 * @example
 * // 기본 사용 (페이지 가시성 고려)
 * const { notifications, hasUnreadNotifications } = useNotifications();
 *
 * @example
 * // 페이지 가시성 무시
 * const { notifications } = useNotifications({ respectVisibility: false });
 *
 * @example
 * // 폴링 간격 조정
 * const { notifications } = useNotifications({ pollingInterval: 30000 });
 */
export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const {
    pollingInterval = 60000,
    enabled = true,
    respectVisibility = true,
  } = options;

  const { user } = useAuthStore();
  const isEmployee = useIsEmployee();

  // 페이지 가시성 감지 (옵션에 따라 활성화)
  const isPageVisible = usePageVisibility(respectVisibility);

  // 상태
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 로딩 상태 (리렌더링 방지를 위해 ref 사용)
  const isLoadingRef = useRef(false);

  /**
   * 서버에서 알림 데이터를 조회하고 상태를 업데이트합니다.
   */
  const fetchNotifications = useCallback(async () => {
    // 조건 체크
    if (!enabled || !isEmployee || !user?.id || isLoadingRef.current) return;

    isLoadingRef.current = true;
    setError(null);

    try {
      const response = await alert.getAlerts(user.id);

      // 'accepted' 또는 'rejected' 상태만 필터링하여 포맷
      const formattedNotifications = response.items
        .filter((alertItem) => {
          const status = alertItem.item.result;
          return status === 'accepted' || status === 'rejected';
        })
        .map((alertItem) => ({
          id: alertItem.item.id,
          shopName: alertItem.item.shop.item.name,
          status: alertItem.item.result,
          time: getWorkTime(
            alertItem.item.notice.item.startsAt,
            alertItem.item.notice.item.workhour
          ),
          read: alertItem.item.read,
        }));

      setNotifications(formattedNotifications);

      // 읽지 않은 알림 존재 여부
      const hasUnread = response.items.some(
        (alertItem) => !alertItem.item.read
      );
      setHasUnreadNotifications(hasUnread);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('알림 조회 실패');
      setError(error);
      console.error('알림 조회 실패:', error);
    } finally {
      isLoadingRef.current = false;
    }
  }, [enabled, isEmployee, user?.id]);

  /**
   * 주기적으로 알림 데이터를 조회합니다.
   * - respectVisibility가 true면 페이지가 보일 때만 폴링
   * - respectVisibility가 false면 항상 폴링
   */
  useEffect(() => {
    // 기본 조건 체크
    if (!enabled || !isEmployee || !user?.id) return;

    // 페이지 가시성 체크 (respectVisibility가 true인 경우)
    if (respectVisibility && !isPageVisible) return;

    // 초기 조회
    fetchNotifications();

    // 주기적 폴링
    const intervalId = setInterval(fetchNotifications, pollingInterval);

    // cleanup
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    enabled,
    isEmployee,
    user?.id,
    pollingInterval,
    isPageVisible,
    respectVisibility,
  ]);

  /**
   * 알림을 읽음 처리하고 알림 목록을 다시 조회합니다.
   */
  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (!user?.id) return;

      try {
        await alert.readAlert(user.id, notificationId);
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

  // 모달 컨트롤 함수들
  const toggleNotification = useCallback(() => {
    setIsNotificationOpen((prev) => !prev);
  }, []);

  const closeNotification = useCallback(() => {
    setIsNotificationOpen(false);
  }, []);

  const openNotification = useCallback(() => {
    setIsNotificationOpen(true);
  }, []);

  return {
    // 상태
    isNotificationOpen,
    notifications,
    hasUnreadNotifications,
    isLoading: isLoadingRef.current,
    error,

    // 액션
    toggleNotification,
    closeNotification,
    openNotification,
    fetchNotifications,
    markAsRead,
  };
};
