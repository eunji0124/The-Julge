import axios, {
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { toast } from 'react-toastify';

import { useAuthStore } from '@/store/useAuthStore';

/**
 * API 베이스 URL 환경 변수
 * 개발 환경에서 누락 시 경고 표시
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 개발 환경에서 환경 변수 누락 체크
if (process.env.NODE_ENV === 'development' && !BASE_URL) {
  console.error(
    '⚠️ API base URL이 정의되지 않았습니다. .env 파일을 확인해주세요.'
  );
}

/**
 * Axios 인스턴스 (토큰 방식)
 * - 기본 URL 및 공통 설정 적용
 * - 5초 타임아웃 설정
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 요청 인터셉터
 * - 모든 요청 전에 실행
 * - Zustand에서 토큰을 가져와 Authorization 헤더에 추가
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const authStorage = localStorage.getItem('auth-token');

      if (authStorage) {
        try {
          /**
           * 🔥 핵심 수정:
           * auth-token → persist 구조(JSON)
           * { state: { token: "JWT", ... }, version: 0 }
           * 여기서 state.token만 정확하게 꺼낸다.
           */
          const parsed = JSON.parse(authStorage);
          const token = parsed?.state?.token;

          if (typeof token === 'string' && token.length > 0) {
            config.headers.Authorization = `Bearer ${token}`;
          }

        } catch (error) {
          console.error('토큰 파싱 에러:', error);
        }
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터
 * - 모든 응답 후 실행
 * - 성공 시: response.data만 반환하여 코드 간소화
 * - 실패 시: 에러 타입별 toast 표시 및 처리
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    let errorMessage = '';

    if (error.code === 'ECONNABORTED') {
      errorMessage = '요청 시간이 초과되었습니다. 다시 시도해 주세요.';
    } else if (error.request && !error.response) {
      errorMessage = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.';
    } else if (error.response?.status && error.response.status >= 500) {
      errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    } else if (error.response?.status === 401) {
      toast.error('로그인이 필요합니다.');

      if (typeof window !== 'undefined') {
        useAuthStore.getState().clearAuth();

        if (window.location.pathname !== '/login') {
          window.location.assign('/login');
        }
      }
      return Promise.reject(error);
    }

    if (errorMessage) toast.error(errorMessage);

    return Promise.reject(error);
  }
);

/**
 * 타입 안전 API 래퍼 함수
 */
export const api = {
  get: <T = unknown>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<T> => apiClient.get<T>(url, config) as Promise<T>,

  post: <T = unknown>(
    url: string,
    data?: unknown,
    config: AxiosRequestConfig = {}
  ): Promise<T> => apiClient.post<T>(url, data, config) as Promise<T>,

  put: <T = unknown>(
    url: string,
    data?: unknown,
    config: AxiosRequestConfig = {}
  ): Promise<T> => apiClient.put<T>(url, data, config) as Promise<T>,

  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config: AxiosRequestConfig = {}
  ): Promise<T> => apiClient.patch<T>(url, data, config) as Promise<T>,

  delete: <T = unknown>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<T> => apiClient.delete<T>(url, config) as Promise<T>,
};

export default apiClient;
