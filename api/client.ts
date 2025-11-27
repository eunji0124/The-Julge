import axios, {
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

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
 * Axios 인스턴스
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
 * - 인증 토큰 추가 등의 전처리 수행
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // TODO: 토큰 추가 로직
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
 * - 실패 시: 에러 타입별 로깅 및 처리
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    // TODO: alert이 아닌 toast 처리 고려
    if (error.code === 'ECONNABORTED') {
      alert('요청 시간이 초과되었습니다. 다시 시도해 주세요.');
    }

    // 네트워크 오류 (요청은 보냈으나 응답을 받지 못함)
    if (error.request && !error.response) {
      alert('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.');
    }

    // 서버 에러 (500번대)
    if (error.response?.status && error.response.status >= 500) {
      alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }

    if (error.response?.status === 401) {
      console.error('인증 에러');
      // TODO: 토큰 갱신 또는 로그인 페이지로 리디렉션하는 로직을 구현
      // 예: window.location.assign('/login');
    }

    return Promise.reject(error);
  }
);

/**
 * 타입 안전 API 래퍼 함수
 * 응답 데이터에 대한 제네릭 타입을 지정하여 타입 안정성을 제공합니다.
 *
 * @example
 * const data = await api.get<UserResponse>('/users/1');
 * const result = await api.post<SignupResponse>('/users', data);
 */
export const api = {
  get: <T = unknown>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<T> => {
    return apiClient.get<T>(url, config) as Promise<T>;
  },

  post: <T = unknown>(
    url: string,
    data?: unknown,
    config: AxiosRequestConfig = {}
  ): Promise<T> => {
    return apiClient.post<T>(url, data, config) as Promise<T>;
  },

  put: <T = unknown>(
    url: string,
    data?: unknown,
    config: AxiosRequestConfig = {}
  ): Promise<T> => {
    return apiClient.put<T>(url, data, config) as Promise<T>;
  },

  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config: AxiosRequestConfig = {}
  ): Promise<T> => {
    return apiClient.patch<T>(url, data, config) as Promise<T>;
  },

  delete: <T = unknown>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<T> => {
    return apiClient.delete<T>(url, config) as Promise<T>;
  },
};

export default apiClient;
