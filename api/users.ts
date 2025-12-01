import { api } from './client';
import { SignupRequest, SignupResponse } from './types';

/**
 * 사용자 프로필 타입
 */
export interface UserProfile {
  id: string;
  email: string;
  type: 'employee' | 'employer';
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
  shop: null | {
    item: {
      id: string;
      name: string;
      category: string;
      address1: string;
      address2: string;
      description: string;
      imageUrl: string;
      originalHourlyPay: number;
    };
    href: string;
  };
}

/**
 * 사용자 정보 조회 응답 타입
 */
export interface UserResponse {
  item: UserProfile;
  links: unknown[];
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

  /**
   * 사용자 정보 조회
   * @param userId - 사용자 ID
   * @returns 사용자 프로필 정보
   */
  getProfile: async (userId: string): Promise<UserResponse> => {
    const response = await api.get<UserResponse>(`/users/${userId}`);
    return response;
  },

  /**
   * 프로필 등록 여부 확인
   * @param profile - 사용자 프로필
   * @returns name, phone, address가 모두 있으면 true
   */
  checkProfileRegistered: (profile: UserProfile): boolean => {
    return !!(profile.name && profile.phone && profile.address);
  },
};

export default users;
