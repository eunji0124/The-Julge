import { create } from 'zustand';

import { User } from '@/api/types';

/**
 * 인증 상태 타입 정의
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User) => void;
  clearAuth: () => void;
}

/**
 * 인증 상태 관리 스토어 (쿠키 방식)
 * - 토큰은 HttpOnly Cookie에 저장 (서버가 관리, XSS 방지)
 * - 사용자 정보만 클라이언트 메모리(Zustand)에 저장
 * - 새로고침 시 Zustand 상태가 초기화되므로 서버에서 사용자 정보 재조회 필요
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  // 로그인: 사용자 정보만 저장
  setAuth(user: User) {
    set({ user, isAuthenticated: true });
  },

  // 로그아웃: 사용자 정보 제거
  clearAuth() {
    set({ user: null, isAuthenticated: false });
  },
}));
