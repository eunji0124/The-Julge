import { useEffect, useState } from 'react';

import { UserApplicationsResponse } from '@/api/types';
import users from '@/api/users';

// useUserApplications 훅의 옵션 타입
interface UseUserApplicationsOptions {
  userId: string | undefined;
  offset?: number;
  limit?: number;
  enabled?: boolean;
}

/**
 * 사용자의 지원 목록을 조회하는 커스텀 훅
 *
 * @param options - userId, offset, limit, enabled 옵션
 * @returns applications, isLoading, error 상태
 */
export const useUserApplications = ({
  userId,
  offset = 0,
  limit = 10,
  enabled = true,
}: UseUserApplicationsOptions) => {
  const [applications, setApplications] =
    useState<UserApplicationsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // enabled가 false이거나 userId가 없으면 실행하지 않음
    if (!enabled || !userId) return;

    const fetchApplications = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await users.getApplications(userId, {
          offset,
          limit,
        });
        setApplications(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : '지원 목록 조회 실패');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [userId, offset, limit, enabled]);

  return { applications, isLoading, error };
};
