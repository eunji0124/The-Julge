import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { ApiErrorResponse } from '@/api/types';
import users from '@/api/users';
import { useAuthStore } from '@/store/useAuthStore';

// 사용자 프로필 데이터 타입 정의
export interface UserProfile {
  name: string;
  phone: string;
  address: string;
  bio: string;
}

// useUserProfile 훅의 반환 타입 정의
interface UseUserProfileReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isNotFound: boolean;
  refetch: () => Promise<void>;
}

// 에러 메시지 상수 정의
const ERROR_MESSAGES = {
  NOT_FOUND: '존재하지 않는 사용자입니다.',
  FETCH_ERROR:
    '프로필 정보를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.',
};

/**
 * API 에러를 분석하여 적절한 에러 메시지와 404 여부를 반환하는 함수
 *
 * @param error - 발생한 에러 객체
 * @returns 에러 메시지와 404 에러 여부를 포함한 객체
 */
const getErrorMessage = (
  error: unknown
): { message: string; isNotFound: boolean } => {
  // Axios 에러이고 응답이 있는 경우에만 상세 처리
  if (isAxiosError<ApiErrorResponse>(error) && error.response) {
    const { status, data } = error.response;

    // 404 에러 처리 (사용자를 찾을 수 없음)
    if (status === 404) {
      return {
        message: data?.message || ERROR_MESSAGES.NOT_FOUND,
        isNotFound: true, // 404 플래그 설정
      };
    }
  }

  // 기타 에러의 경우 일반 에러 메시지 반환
  return {
    message: ERROR_MESSAGES.FETCH_ERROR,
    isNotFound: false,
  };
};

/**
 * 프로필의 모든 필드가 비어있는지 확인하는 함수
 *
 * 모든 필드가 빈 문자열인 경우 프로필이 등록되지 않은 것으로 판단
 *
 * @param profile - 검사할 프로필 객체
 * @returns 모든 필드가 비어있으면 true, 하나라도 값이 있으면 false
 */
const isEmptyProfile = (profile: UserProfile): boolean => {
  return (
    profile.name === '' &&
    profile.phone === '' &&
    profile.address === '' &&
    profile.bio === ''
  );
};

/**
 * React Query를 사용한 사용자 프로필 조회 커스텀 훅
 *
 * 주요 기능:
 * - 자동 캐싱으로 중복 요청 방지
 * - 동일한 userId로 여러 컴포넌트에서 호출해도 한 번만 요청
 * - 캐시 유효 시간 관리 (5분간 fresh, 10분간 유지)
 * - 404 에러 별도 처리 (신규 사용자 구분)
 *
 * @returns 프로필 데이터, 로딩 상태, 에러 정보, 재조회 함수
 */
export const useUserProfile = (): UseUserProfileReturn => {
  // Zustand store에서 현재 로그인한 사용자 정보 가져오기
  const user = useAuthStore((state) => state.user);

  // React Query의 useQuery 훅으로 프로필 데이터 조회
  const {
    data: profile, // 조회된 프로필 데이터
    isLoading, // 로딩 상태
    error: queryError, // 발생한 에러
    refetch: queryRefetch, // 재조회 함수
  } = useQuery({
    // 쿼리 키: userId가 변경되면 새로운 쿼리로 인식
    queryKey: ['userProfile', user?.id],

    // 쿼리 함수: 실제 API 호출 로직
    queryFn: async () => {
      // 사용자 ID가 없으면 에러 발생
      if (!user?.id) {
        throw new Error('User ID not found');
      }

      // API 호출로 사용자 정보 가져오기
      const response = await users.getUser(user.id);
      const userData = response.item;

      // API 응답을 UserProfile 타입으로 변환
      // 각 필드가 없을 경우 빈 문자열로 초기화
      const userProfile: UserProfile = {
        name: userData.name || '',
        phone: userData.phone || '',
        address: userData.address || '',
        bio: userData.bio || '',
      };

      // 모든 필드가 비어있으면 null 반환
      if (isEmptyProfile(userProfile)) {
        return null;
      }

      return userProfile;
    },

    // user.id가 없으면 쿼리 실행 안 함
    enabled: !!user?.id,

    // 5분간 데이터를 fresh 상태로 유지 (재요청 안 함)
    staleTime: 5 * 60 * 1000,

    // 캐시 유지 시간: 10분
    gcTime: 10 * 60 * 1000,

    // 에러 발생 시 재시도 안 함
    retry: false,
  });

  // 에러가 발생한 경우 에러 정보 파싱
  const errorInfo = queryError ? getErrorMessage(queryError) : null;

  /**
   * 프로필 재조회 함수
   *
   * 컴포넌트에서 명시적으로 최신 데이터를 가져오고 싶을 때 사용
   * 예: 프로필 수정 후 즉시 업데이트된 내용 확인
   */
  const refetch = async () => {
    await queryRefetch();
  };

  return {
    profile: profile || null, // 프로필 데이터 (없으면 null)
    isLoading, // 로딩 상태
    error: errorInfo?.message || null, // 에러 메시지 (없으면 null)
    isNotFound: errorInfo?.isNotFound || false, // 404 에러 여부
    refetch, // 재조회 함수
  };
};
