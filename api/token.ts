import { api } from './client';
import { LoginRequest, LoginResponse } from './types';

/**
 * 인증(Token) API
 *
 * 인증 관련 API 엔드포인트를 관리
 */
const token = {
  /**
   * 로그인
   * @param data - 로그인 정보 (email, password)
   * @return LoginResponse - 토큰 및 사용자 정보
   */
  login: (data: LoginRequest) => api.post<LoginResponse>('/token', data),
};

export default token;
