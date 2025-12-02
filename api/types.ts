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
 * API 에러 응답 타입
 */
export interface ApiErrorResponse {
  message: string;
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
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
  shop?: { item: { id: string } & ShopRequest };
}
export interface UserInfo {
  item: User;
  links: ApiLink[];
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

/**
 * 로그인 요청 타입
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * 로그인 응답 타입
 */
export interface LoginResponse {
  item: {
    token: string; // JWT 토큰
    user: {
      item: User;
      href: string;
    };
  };
}

/**
 * 내 정보 수정 요청 타입
 */
export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

/**
 * 내 정보 수정 응답 타입
 */
export interface UpdateUserResponse {
  item: User;
  links: ApiLink[];
}

/**
 * 가게
 */
export interface ShopRequest {
  name: string;
  category:
    | '한식'
    | '중식'
    | '일식'
    | '양식'
    | '분식'
    | '카페'
    | '편의점'
    | '기타';
  address1:
    | '서울시 종로구'
    | '서울시 중구'
    | '서울시 용산구'
    | '서울시 성동구'
    | '서울시 광진구'
    | '서울시 동대문구'
    | '서울시 중랑구'
    | '서울시 성북구'
    | '서울시 강북구'
    | '서울시 도봉구'
    | '서울시 노원구'
    | '서울시 은평구'
    | '서울시 서대문구'
    | '서울시 마포구'
    | '서울시 양천구'
    | '서울시 강서구'
    | '서울시 구로구'
    | '서울시 금천구'
    | '서울시 영등포구'
    | '서울시 동작구'
    | '서울시 관악구'
    | '서울시 서초구'
    | '서울시 강남구'
    | '서울시 송파구'
    | '서울시 강동구';
  address2: string;
  description: string;
  imageUrl: string;
  originalHourlyPay: number;
}

export interface ShopResponse {
  item: { id: string } & ShopRequest;
  user: {
    item: User;
    href: 'string';
  };
  links?: ApiLink[];
}

/**
 * 공고
 */

/**
 * 공고 조회
 */
export interface GetNoticesQuery {
  offset?: number; // 조회 시작 기준
  limit?: number; // 조회 개수
  address?: string; // 위치 설정
  keyword?: string; // 검색어 설정
  startsAtGte?: string; // 시작 시점, RFC 3339 형식
  hourlyPayGte?: number; // 금액 설정
  sort?: 'time' | 'pay' | 'hour' | 'shop'; // 정렬 기준
}
export interface NoticeRequest {
  hourlyPay: number;
  startsAt: string; // 양식: 2023-12-23T00:00:00Z
  workhour: number;
  description: string;
}
export interface NoticeResponse {
  offset: number;
  limit: number;
  count: number; // 전체 개수
  hasNext: boolean; // 다음 내용 존재 여부
  address: string[];
  keyword?: string;
  items: {
    item: { id: string } & NoticeRequest & {
        shop: { item: ShopRequest; href: string };
      };
    links?: ApiLink[];
  }[];
  links?: ApiLink[];
}

/**
 * 가게의 공고 목록 조회
 */
export interface GetShopNoticesQuery {
  offset?: number; // 조회 시작 기준
  limit?: number; // 조회 개수
}
export interface ShopNoticesResponse {
  offset: number;
  limit: number;
  count: number; // 전체 개수
  hasNext: boolean; // 다음 내용 존재 여부
  items: {
    item: { id: string } & NoticeRequest & { closed: boolean };
    links: ApiLink[];
  }[];
  links: ApiLink[];
}

/**
 * 가게의 공고 등록
 */

export interface ShopNoticeResponse {
  item: {
    id: string;
    closed: boolean;
    shop: {
      item: { id: string } & ShopRequest;
      href: string;
    };
  } & NoticeRequest;
  links: ApiLink[];
}

/**
 *  가게의 특정 공고 조회
 */
export interface ShopNoticeDetailResponse {
  item: { id: string } & NoticeRequest & { closed: boolean } & {
      shop: { item: { id: string } & ShopRequest } & { href: string };
      currentUserApplication: {
        item: {
          id: string;
          status: 'pending' | 'accepted' | 'rejected' | 'canceled'; // application.status
          createdAt: string; // application.createdAt
        };
      };
    };
  links: ApiLink[];
}

/**
 * 가게의 특정 공고의 지원 목록 조회
 */

export interface GetApplicationsQuery {
  offset?: number; // 조회 시작 기준
  limit?: number; // 조회 개수
}

export interface ApplicationItem {
  id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'canceled';
  createdAt: string;
  user: {
    item: User;
    href: string;
  };
  shop: {
    item: { id: string } & ShopRequest;
    href: string;
  };
  notice: {
    item: { id: string } & NoticeRequest & { closed: boolean };
    href: string;
  };
}

/**
 *  유저의 지원 목록
 */

export interface ApplicationsResponse {
  offset: number;
  limit: number;
  count: number; // 전체 개수
  hasNext: boolean; // 다음 내용 존재 여부
  items: {
    item: ApplicationItem;
    links: ApiLink[];
  }[];
  links: ApiLink[];
}

/**
 * 유저의 지원 목록 조회 응답 (user 정보 제외)
 */
export interface UserApplicationItem {
  id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'canceled';
  createdAt: string;
  shop: {
    item: { id: string } & ShopRequest;
    href: string;
  };
  notice: {
    item: { id: string } & NoticeRequest & { closed: boolean };
    href: string;
  };
}

export interface UserApplicationsResponse {
  offset: number;
  limit: number;
  count: number;
  hasNext: boolean;
  items: {
    item: UserApplicationItem;
    links: ApiLink[];
  }[];
  links: ApiLink[];
}

/**
 * 가게의 특정 공고 지원 승인, 거절 또는 취소
 */
export interface UpdateApplicationRequest {
  status: 'accepted' | 'rejected' | 'canceled';
}

export interface UpdateApplicationResponse {
  item: ApplicationItem;
  links: ApiLink[];
}
