import { api } from './client';
import {
  SignupRequest,
  SignupResponse,
  UserInfo,
  UpdateUserRequest,
  UpdateUserResponse,
} from './types';

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

  /**
   * 내 정보 조회
   * @param user_id - 사용자 ID
   * @returns 사용자 정보
   */
  getUser: async (user_id: string) => {
    const response = await api.get<UserInfo>(`/users/${user_id}`);
    return response;
  },

  /**
   * 내 정보 수정
   * @param userId - 사용자 ID
   * @param data - 수정할 정보 (name, phone, address, bio)
   * @returns 수정된 사용자 정보
   */
  updateUser: async (userId: string, data: UpdateUserRequest) => {
    const response = await api.put<UpdateUserResponse>(
      `/users/${userId}`,
      data
    );
    return response;
  },
};

export default users;
