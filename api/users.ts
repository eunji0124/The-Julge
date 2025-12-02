import { api } from './client';
import {
  SignupRequest,
  SignupResponse,
  User,
  ApiLink,
  GetApplicationsQuery,
  UserApplicationsResponse,
} from './types';

export interface UserResponse {
  item: User;
  links: ApiLink[];
}
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
  getUser: (userId: string) => {
    return api.get<{ item: User }>(`/users/${userId}`);
  },
  /**
   * 사용자 정보 조회
   * @param userId - 사용자 ID
   * @returns 사용자 프로필 정보
   */
  getProfile: async (userId: string): Promise<UserResponse> => {
    return await api.get<UserResponse>(`/users/${userId}`);
  },

  /**
   * 프로필 등록 여부 확인
   * @param profile - 사용자 프로필
   * @returns name, phone, address가 모두 있으면 true
   */
  checkProfileRegistered: (profile: User): boolean => {
    return !!(profile.name && profile.phone && profile.address);
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
