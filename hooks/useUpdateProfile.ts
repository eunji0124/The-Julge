import { useMemo, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { ApiErrorResponse } from '@/api/types';
import users from '@/api/users';
import { UserProfile } from '@/hooks/useUserProfile';
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
};

/**
 * API 에러 응답을 에러 메시지로 변환
 * @param error - 발생한 에러 객체
 * @returns 사용자에게 표시할 에러 메시지
 */
const getErrorMessage = (error: unknown): string => {
  // Axios 에러가 아니거나 응답이 없는 경우
  if (!isAxiosError<ApiErrorResponse>(error) || !error.response) {
    return MODAL_MESSAGES.PROCESSING_ERROR;
  }

  const { status, data } = error.response;

  // HTTP 상태 코드별 에러 메시지 매핑
  switch (status) {
    case 403:
      // 권한 없음 (Forbidden)
      return MODAL_MESSAGES.ERROR_FORBIDDEN;
    case 404:
      // 리소스를 찾을 수 없음 (Not Found)
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
 *
 * React Query Mutation을 사용하여 서버 업데이트 후 캐시 자동 갱신
 * form 상태 관리, 유효성 검사, 변경 감지 기능 제공
 *
 * @param initialProfile - 초기 프로필 데이터 (수정 모드일 경우 전달)
 * @returns form 상태 및 핸들러 함수들
 */
export const useUpdateProfile = (initialProfile?: UserProfile | null) => {
  const queryClient = useQueryClient();

  // Zustand store에서 현재 로그인한 사용자 정보 가져오기
  const user = useAuthStore((state) => state.user);

  // 기본 프로필 데이터 구조 정의 (신규 등록 시 사용)
  const defaultData: UserProfile = {
    name: '',
    phone: '',
    address: '',
    bio: '',
  };

  // 현재 form 데이터 상태 (초기값: 전달받은 프로필 또는 기본값)
  const [formData, setFormData] = useState<UserProfile>(
    initialProfile || defaultData
  );

  // 초기 데이터 저장 (변경 여부 비교용)
  const [initialData] = useState<UserProfile>(initialProfile || defaultData);

  // React Query Mutation: 프로필 업데이트 API 호출
  const mutation = useMutation({
    // 실제 API 호출 함수
    mutationFn: async (data: UserProfile) => {
      // 로그인 상태 확인 - 사용자 ID가 없으면 에러 발생
      if (!user?.id) {
        throw new Error(MODAL_MESSAGES.REQUIRED_LOGIN);
      }

      // users API를 통해 프로필 업데이트 요청
      return await users.updateUser(user.id, {
        name: data.name,
        phone: data.phone,
        address: data.address,
        bio: data.bio || '',
      });
    },
    // 업데이트 성공 시 실행되는 콜백
    onSuccess: () => {
      // 캐시 무효화 → 다음 조회 시 최신 데이터를 서버에서 가져옴
      // 이를 통해 UI가 자동으로 최신 상태로 업데이트됨
      queryClient.invalidateQueries({
        queryKey: ['userProfile', user?.id],
      });
    },
  });

  /**
   * form 데이터가 초기 데이터와 비교하여 변경되었는지 확인
   *
   * useMemo를 사용하여 formData나 initialData가 변경될 때만 재계산
   * 이를 통해 불필요한 재계산을 방지하고 성능 최적화
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
   *
   * input 또는 textarea의 값이 변경될 때 호출됨
   * Mutation 진행 중에는 입력을 막아 동시 수정 방지
   *
   * @param e - 입력 이벤트 객체 (input 또는 textarea)
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // Mutation 진행 중이 아닐 때만 상태 업데이트
    if (!mutation.isPending) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value, // 동적으로 필드명을 사용하여 값 업데이트
      });
    }
  };

  /**
   * 프로필 등록/수정 제출 핸들러
   *
   * 필수 필드 유효성 검사를 수행한 후 API 호출
   * 성공/실패 시 각각의 콜백 함수를 실행
   *
   * @param onSuccess - 성공 시 실행할 콜백 (메시지 전달)
   * @param onError - 실패 시 실행할 콜백 (에러 메시지 전달)
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

    // 로그인 상태 확인
    if (!user?.id) {
      onError(MODAL_MESSAGES.REQUIRED_LOGIN);
      return;
    }

    try {
      // Mutation 실행 (비동기)
      await mutation.mutateAsync(formData);
      // 성공 시 성공 메시지와 함께 콜백 실행
      onSuccess(MODAL_MESSAGES.SUCCESS);
    } catch (error) {
      // 실패 시 에러 메시지 파싱 후 콜백 실행
      onError(getErrorMessage(error));
    }
  };

  // form 관리에 필요한 상태와 함수들 반환
  return {
    formData, // 현재 form 데이터
    isLoading: mutation.isPending, // Mutation의 로딩 상태
    hasFormChanged, // form 변경 여부
    handleChange, // 입력 변경 핸들러
    handleSubmit, // form 제출 핸들러
  };
};
