import { useRouter } from 'next/router';

import { useQueryClient, useMutation } from '@tanstack/react-query';
import axios, { isAxiosError } from 'axios';
import { toast } from 'react-toastify';

import { ApiErrorResponse } from '@/api/types';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * 로그아웃 mutation 훅
 * - Next.js API Route를 통해 로그아웃
 * - 서버가 HttpOnly Cookie 삭제
 * - 클라이언트는 사용자 정보 제거
 */
const useLogout = () => {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/auth/logout', null, {
        withCredentials: true, // 쿠키 포함
      });
      return response.data;
    },

    onSuccess: () => {
      // Zustand에서 사용자 정보 제거
      clearAuth();
      // 모든 캐시 제거
      queryClient.clear();
      // 로그인 페이지로 리다이렉트
      router.push('/login');
    },

    onError: (error) => {
      console.error('로그아웃 실패:', error);

      // axios 에러 타입 체크
      if (isAxiosError<ApiErrorResponse>(error) && error.response) {
        const errorMessage =
          error.response?.data?.message || '로그아웃에 실패했습니다.';
        toast.error(errorMessage);
      } else {
        toast.error('로그아웃 처리 중 오류가 발생했습니다.');
      }
    },
  });
};

export default useLogout;
