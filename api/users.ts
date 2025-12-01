import { api } from './client';
import { SignupRequest, SignupResponse, UserInfo } from './types';

/**
 * 유저(Users) API
 *
 * 유저 관련 API 엔드포인트를 관리
 */
const users = {
  /**
   * 회원가입
   * @param data - 회원가입 정보 (email, password, type)
   * @returns 생성된 유저 정보
   */
  signup: async (data: SignupRequest) => {
    const response = await api.post<SignupResponse>('/users', data);
    return response;
  },
  // 내 정보 조회
  getUser: async (user_id: string) => {
    const response = await api.get<UserInfo>(`/users/${user_id}`);
    return response;
  },
};

export default users;
