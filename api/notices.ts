import { api } from './client';

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
}

export interface NoticeListResponse {
  offset: number;
  limit: number;
  address: string[];
  count: number;
  hasNext: boolean;
  items: {
    item: NoticeItem;
    links: unknown[];
  }[];
}

export interface FetchNoticeListParams {
  offset?: number;
  limit?: number;
  address?: string[];
  keyword?: string;
  startsAtGte?: string;
  hourlyPayGte?: number;
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

  const response = await api.get<NoticeListResponse>(
    `/notices?${queryParams.toString()}`
  );

  return response;
}
