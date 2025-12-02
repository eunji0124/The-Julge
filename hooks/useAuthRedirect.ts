import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import { useAuthStore } from '@/store/useAuthStore';

/**
 * 인증 상태를 확인하고 미인증 시 리다이렉트하는 훅
 * @param redirectTo - 미인증 시 리다이렉트할 경로 (기본값: '/login')
 * @returns isReady - hydration 완료 여부
 * @returns isAuthenticated - 인증 여부
 */
export const useAuthRedirect = (redirectTo: string = '/login') => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  // 로그인 여부
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 리다이렉트 추적용 ref (중복 리다이렉트 방지)
  const hasRedirected = useRef(false);

  // hydration 대기
  useEffect(() => {
    setIsReady(true);
  }, []);

  // 인증 확인: 준비가 완료된 후에만 리다이렉트
  useEffect(() => {
    if (isReady && !isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace(redirectTo);
    }
  }, [isReady, isAuthenticated, router, redirectTo]);

  return {
    isReady,
    isAuthenticated,
  };
};
