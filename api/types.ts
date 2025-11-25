/**
 * API 요청/응답 타입 정의
 *
 * 이 파일은 API 통신에 사용되는 요청(Request)과 응답(Response) 타입을 정의합니다.
 * 각 API 엔드포인트별로 타입을 그룹화하여 관리합니다.
 *
 * @example
 * import { SignupRequest, SignupResponse } from '@/apis/types';
 *
 * const data: SignupRequest = { email, password, ... };
 * const response: SignupResponse = await authApi.signup(data);
 */

/**
 * API 공통 타입
 */
export interface ApiLink {
  rel: string;
  description: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  href: string;
  body?: Record<string, unknown>;
}

/**
 * 사용자 유형
 * - EMPLOYEE: 직원 (알바생)
 * - EMPLOYER: 고용주 (사장님)
 */
export enum UserType {
  EMPLOYEE = 'employee',
  EMPLOYER = 'employer',
}

/**
 * 사용자 정보
 */
export interface User {
  id: string;
  email: string;
  type: UserType;
}

/**
 * 회원가입 요청 타입
 */
export interface SignupRequest {
  email: string;
  password: string;
  type: UserType;
}

/**
 * 회원가입 응답 타입
 */
export interface SignupResponse {
  item: User;
  links: ApiLink[];
}
