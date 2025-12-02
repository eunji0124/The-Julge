import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { User } from '@/api/types';

/**
 * 인증 상태 타입 정의
 */
interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}

/**
 * persist 옵션 상수 - 키 이름 중복 방지
 */
const persistOptions = {
  name: 'auth-token', // localStorage 키 이름
  // token과 user만 persist
  partialize: (state: AuthState) => ({
    token: state.token,
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }),
};

/**
 * 인증 상태 관리 스토어 (토큰 기반)
 * - token을 localStorage에 persist하여 새로고침 시에도 유지
 * - 사용자 정보도 함께 저장
 * - API 요청 시 token을 Authorization 헤더에 포함
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      // 로그인: 토큰과 사용자 정보 저장
      setAuth(token: string, user: User) {
        set({ token, user, isAuthenticated: true });
      },

      // 로그아웃: 토큰과 사용자 정보 제거
      clearAuth() {
        set({ token: null, user: null, isAuthenticated: false });
        // localStorage에서 완전히 제거 - persistOptions.name 사용
        localStorage.removeItem(persistOptions.name);
      },
    }),
    persistOptions
  )
);
