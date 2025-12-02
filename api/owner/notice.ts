import { api } from '../client';
import {
  GetNoticesQuery,
  GetShopNoticesQuery,
  NoticeResponse,
  ShopNoticeResponse,
  ShopNoticeDetailResponse,
  NoticeRequest,
  ShopNoticesResponse,
} from '../types';

const noticesApi = {
  // 공고 조회
  getNotices: async (query?: GetNoticesQuery) => {
    return api.get<NoticeResponse>('/notices', {
      params: query,
    });
  },

  // 가게의 공고 목록 조회
  getShopNoticeList: async (shop_id: string, query?: GetShopNoticesQuery) => {
    return api.get<ShopNoticesResponse>(`/shops/${shop_id}/notices`, {
      params: query,
    });
  },

  // 가게 공고 등록
  postShopNotice: async (shop_id: string, data: NoticeRequest) => {
    return api.post<ShopNoticeResponse>(`/shops/${shop_id}/notices`, data);
  },

  // 가게의 특정 공고 조회
  getShopNotice: async (shop_id: string, notice_id: string) => {
    return api.get<ShopNoticeDetailResponse>(
      `/shops/${shop_id}/notices/${notice_id}`
    );
  },
};

export default noticesApi;
