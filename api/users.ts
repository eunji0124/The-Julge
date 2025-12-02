import { api } from './client';
import {
  SignupRequest,
  SignupResponse,
  UserInfo,
  UpdateUserRequest,
  UpdateUserResponse,
  GetApplicationsQuery,
  UserApplicationsResponse,
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

  /**
   * 유저의 지원 목록 조회
   * @param userId - 사용자 ID
   * @param query - 쿼리 파라미터 (offset, limit)
   * @returns 지원 목록
   */
  getApplications: async (userId: string, query?: GetApplicationsQuery) => {
    const params = new URLSearchParams();
    if (query?.offset !== undefined)
      params.append('offset', String(query.offset));
    if (query?.limit !== undefined) params.append('limit', String(query.limit));

    const queryString = params.toString();
    const url = `/users/${userId}/applications${queryString ? `?${queryString}` : ''}`;

    const response = await api.get<UserApplicationsResponse>(url);
    return response;
  },
};

export default users;
