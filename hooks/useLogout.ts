import { useRouter } from 'next/router';

import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { useAuthStore } from '@/store/useAuthStore';

/**
 * 로그아웃 mutation 훅 (토큰 기반)
 * - 클라이언트에서 토큰과 사용자 정보 제거
 * - 별도의 API 호출 없이 로컬에서 처리
 * - 서버에서 토큰 무효화가 필요한 경우 API 호출 추가 가능
 */
const useLogout = () => {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // 서버에 로그아웃 API가 있다면 여기서 호출
      // await api.post('/auth/logout');

      // 토큰 기반 인증에서는 클라이언트에서만 처리
      return Promise.resolve();
    },

    onSuccess: () => {
      // Zustand에서 토큰과 사용자 정보 제거
      clearAuth();

      // 모든 캐시 제거
      queryClient.clear();

      toast.success('로그아웃되었습니다.');

      // 로그인 페이지로 리다이렉트
      router.push('/login');
    },

    onError: (error) => {
      console.error('로그아웃 실패:', error);
      toast.error('로그아웃 처리 중 오류가 발생했습니다.');
    },
  });
};

export default useLogout;
