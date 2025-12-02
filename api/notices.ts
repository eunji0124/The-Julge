import { api } from './client';
import { ApiLink } from './types';

export interface ShopItem {
  id: string;
  name: string;
  category: string;
  address1: string;
  address2: string;
  description: string;
  imageUrl: string;
  originalHourlyPay: number;
}

export interface NoticeItem {
  id: string;
  hourlyPay: number;
  startsAt: string;
  workhour: number;
  description: string;
  closed: boolean;
  shop: {
    item: ShopItem;
    href: string;
  };
  currentUserApplication?: {
    item: {
      id: string;
      status: 'pending' | 'accepted' | 'rejected' | 'canceled';
    };
    href: string;
  } | null;
}

export interface NoticeListResponse {
  offset: number;
  limit: number;
  address: string[];
  count: number;
  hasNext: boolean;
  items: {
    item: NoticeItem;
    links: ApiLink[];
  }[];
}

export interface NoticeDetailResponse {
  item: NoticeItem;
  links: ApiLink[];
}

export interface FetchNoticeListParams {
  offset?: number;
  limit?: number;
  address?: string[];
  keyword?: string;
  startsAtGte?: string;
  hourlyPayGte?: number;
  // 백엔드 정렬 파라미터 추가
  sort?: 'time' | 'pay' | 'hour' | 'shop';
  order?: 'asc' | 'desc';
}

// 공고 신청 응답 타입
export interface ApplyNoticeResponse {
  item: {
    id: string;
    status: 'pending' | 'accepted' | 'rejected' | 'canceled';
    createdAt: string;
  };
  links: ApiLink[];
}

// 공고 신청 취소 응답 타입
export interface CancelApplicationResponse {
  item: {
    id: string;
    status: 'canceled';
  };
  links: ApiLink[];
}

// 공고 목록 조회
export async function fetchNoticeList(params: FetchNoticeListParams = {}) {
  const {
    offset = 0,
    limit = 6,
    address = [],
    keyword,
    startsAtGte,
    hourlyPayGte,
    sort,
    order,
  } = params;

  const queryParams = new URLSearchParams();
  queryParams.append('offset', offset.toString());
  queryParams.append('limit', limit.toString());

  if (address.length > 0) {
    address.forEach((addr) => queryParams.append('address', addr));
  }

  if (keyword) {
    queryParams.append('keyword', keyword);
  }

  if (startsAtGte) {
    queryParams.append('startsAtGte', startsAtGte);
  }

  if (hourlyPayGte != null) {
    queryParams.append('hourlyPayGte', hourlyPayGte.toString());
  }

  // 백엔드 정렬 파라미터 추가
  if (sort) {
    queryParams.append('sort', sort);
  }

  if (order) {
    queryParams.append('order', order);
  }

  const response = await api.get<NoticeListResponse>(
    `/notices?${queryParams.toString()}`
  );

  return response;
}

// 공고 상세 조회
export async function fetchNoticeDetail(
  shopId: string,
  noticeId: string
): Promise<NoticeDetailResponse> {
  const response = await api.get<NoticeDetailResponse>(
    `/shops/${shopId}/notices/${noticeId}`
  );

  return response;
}

// 공고 신청 API
export const applyNotice = async (
  shopId: string,
  noticeId: string
): Promise<ApplyNoticeResponse> => {
  const response = await api.post<ApplyNoticeResponse>(
    `/shops/${shopId}/notices/${noticeId}/applications`
  );
  return response;
};

// 공고 신청 취소 API
export const cancelApplication = async (
  shopId: string,
  noticeId: string,
  applicationId: string
): Promise<CancelApplicationResponse> => {
  const response = await api.put<CancelApplicationResponse>(
    `/shops/${shopId}/notices/${noticeId}/applications/${applicationId}`,
    { status: 'canceled' }
  );
  return response;
};
