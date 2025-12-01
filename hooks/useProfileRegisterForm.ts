import { useEffect, useMemo, useState } from 'react';

import { isAxiosError } from 'axios';

import { ApiErrorResponse } from '@/api/types';
import users from '@/api/users';
import { useAuthStore } from '@/store/useAuthStore';

// Modal에 표시될 메시지 상수 정의
export const MODAL_MESSAGES = {
  REQUIRED_NAME: '이름을 입력해주세요.',
  REQUIRED_PHONE: '연락처를 입력해주세요.',
  REQUIRED_LOGIN: '로그인이 필요합니다.',
  SUCCESS: '등록이 완료되었습니다.',
  ERROR_DEFAULT: '등록에 실패했습니다.',
  ERROR_ADDRESS: '시군구 주소가 올바르지 않습니다.',
  ERROR_FORBIDDEN: '권한이 없습니다',
  ERROR_NOT_FOUND: '존재하지 않는 사용자입니다',
  PROCESSING_ERROR: '프로필 등록 처리 중 오류가 발생했습니다.',
  FETCH_ERROR:
    '프로필 정보를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.',
};

// form 데이터 타입 정의
interface FormData {
  name: string;
  phone: string;
  address: string;
  bio: string;
}

/**
 * API 에러를 분석하여 적절한 에러 메시지를 반환하는 함수
 * @param error - 발생한 에러 객체
 * @returns 사용자에게 표시할 에러 메시지
 */
const getErrorMessage = (error: unknown): string => {
  // Axios 에러가 아닌 경우
  if (!isAxiosError<ApiErrorResponse>(error) || !error.response) {
    return MODAL_MESSAGES.PROCESSING_ERROR;
  }

  const { status, data } = error.response;

  // HTTP 상태 코드별 에러 메시지 매핑
  switch (status) {
    case 403:
      return MODAL_MESSAGES.ERROR_FORBIDDEN;

    case 404:
      return MODAL_MESSAGES.ERROR_NOT_FOUND;

    case 400:
      // 메세지에 '시군구 주소가 올바르지 않습니다.'가 포함되어 있을 경우
      if (data?.message?.includes(MODAL_MESSAGES.ERROR_ADDRESS)) {
        return MODAL_MESSAGES.ERROR_ADDRESS;
      }

      // 서버에서 반환한 메시지가 있으면 그대로 사용
      return data?.message || MODAL_MESSAGES.ERROR_DEFAULT;

    default:
      // 기타 상태 코드의 경우 서버 메시지 또는 기본 메시지 반환
      return data?.message || MODAL_MESSAGES.ERROR_DEFAULT;
  }
};

/**
 * 사용자 프로필 등록/수정 form을 관리하는 커스텀 훅
 * @returns form 데이터, 로딩 상태, 변경 여부, 핸들러 함수들
 */
export const useProfileRegisterForm = () => {
  // 현재 form 데이터 상태
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    address: '',
    bio: '',
  });

  // 초기 form 데이터 (변경 여부 확인용)
  const [initialData, setInitialData] = useState<FormData>({
    name: '',
    phone: '',
    address: '',
    bio: '',
  });

  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(false);

  // 프로필 정보 로딩 실패 시 에러 메시지
  const [fetchError, setFetchError] = useState<string | null>(null);

  // 전역 상태에서 현재 로그인한 사용자 정보 가져오기
  const user = useAuthStore((state) => state.user);

  // 컴포넌트 마운트 시 사용자 프로필 데이터 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      // 사용자 ID가 있을 때만 실행
      if (user?.id) {
        try {
          setIsLoading(true);
          setFetchError(null); // 재시도 시 이전 에러 초기화

          // API를 통해 사용자 정보 조회
          const response = await users.getUser(user.id);
          const userData = response.item;

          // 응답 데이터를 form 데이터 형식으로 변환
          const profileData = {
            name: userData.name || '',
            phone: userData.phone || '',
            address: userData.address || '',
            bio: userData.bio || '',
          };

          // 현재 form 데이터와 초기 데이터에 모두 설정
          setFormData(profileData);
          setInitialData(profileData);
        } catch (error) {
          console.error('사용자 정보 조회 실패:', error);
          // 사용자에게 표시할 에러 메시지 설정
          setFetchError(MODAL_MESSAGES.FETCH_ERROR);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user?.id]); // user.id가 변경될 때마다 실행

  /**
   * form 데이터가 초기 데이터와 비교하여 변경되었는지 확인
   * useMemo를 사용하여 formData나 initialData가 변경될 때만 재계산
   */
  const hasFormChanged = useMemo(() => {
    return (
      formData.name !== initialData.name ||
      formData.phone !== initialData.phone ||
      formData.address !== initialData.address ||
      formData.bio !== initialData.bio
    );
  }, [formData, initialData]);

  /**
   * 입력 필드 변경 이벤트 핸들러
   * @param e - 입력 필드 변경 이벤트
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // 로딩 중이 아닐 때만 입력 허용
    if (!isLoading) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value, // 동적으로 필드명에 해당하는 값 업데이트
      });
    }
  };

  /**
   * 프로필 등록/수정 제출 핸들러
   * @param onSuccess - 성공 시 실행될 콜백 함수
   * @param onError - 실패 시 실행될 콜백 함수
   */
  const handleSubmit = async (
    onSuccess: (message: string) => void,
    onError: (message: string) => void
  ) => {
    // 필수 필드 유효성 검사: 이름
    if (!formData.name.trim()) {
      onError(MODAL_MESSAGES.REQUIRED_NAME);
      return;
    }

    // 필수 필드 유효성 검사: 연락처
    if (!formData.phone.trim()) {
      onError(MODAL_MESSAGES.REQUIRED_PHONE);
      return;
    }

    // 로그인 여부 확인
    if (!user?.id) {
      onError(MODAL_MESSAGES.REQUIRED_LOGIN);
      return;
    }

    setIsLoading(true);

    try {
      // API를 통해 사용자 정보 업데이트
      await users.updateUser(user.id, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        bio: formData.bio || '',
      });

      // 성공 콜백 실행
      onSuccess(MODAL_MESSAGES.SUCCESS);
    } catch (error) {
      // 실패 콜백 실행
      onError(getErrorMessage(error));
    } finally {
      // 로딩 상태 해제
      setIsLoading(false);
    }
  };

  // 훅에서 반환할 값들
  return {
    formData, // 현재 form 데이터
    isLoading, // 로딩 상태
    fetchError, // 프로필 정보 로딩 실패 시 에러 메시지
    hasFormChanged, // form 변경 여부 (useMemo로 최적화됨)
    handleChange, // 입력 필드 변경 핸들러
    handleSubmit, // form 제출 핸들러
  };
};
