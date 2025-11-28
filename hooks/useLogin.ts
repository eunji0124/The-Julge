import { useRouter } from 'next/router';

import { useMutation } from '@tanstack/react-query';
import axios, { isAxiosError } from 'axios';
import { toast } from 'react-toastify';

import { ApiErrorResponse, LoginRequest } from '@/api/types';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * 로그인 mutation 훅 (쿠키 방식)
 * - Next.js API Route를 통해 로그인
 * - 서버가 HttpOnly Cookie에 토큰 저장
 * - 클라이언트는 사용자 정보만 받음
 * - 비밀번호 관련 에러는 toast 대신 에러 정보를 반환하여 Modal로 표시
 */
const useLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await axios.post('/api/auth/login', data, {
        withCredentials: true, // 쿠키 포함
      });
      return response.data;
    },

    onSuccess: (data) => {
      // 사용자 정보만 Zustand에 저장
      setAuth(data.user);

      // 로그인 성공 후 홈으로 리다이렉트
      router.push('/');
    },

    onError: (error) => {
      console.error('로그인 실패:', error);

      // axios 에러 타입 체크
      if (isAxiosError<ApiErrorResponse>(error) && error.response) {
        const errorMessage =
          error.response?.data?.message || '로그인에 실패했습니다.';
        const statusCode = error.response?.status;

        // 404 에러 (비밀번호 또는 이메일 불일치)는 toast 표시 대신 컴포넌트에서 error를 통해 Modal을 띄울 수 있도록 처리
        if (statusCode === 404) {
          // toast를 표시하지 않고 에러만 throw
          return;
        }

        // 그 외 에러는 toast로 표시
        toast.error(errorMessage);
      } else {
        toast.error('로그인 처리 중 오류가 발생했습니다.');
      }
    },
  });
};

export default useLogin;
