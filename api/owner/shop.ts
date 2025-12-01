import { api } from '../client';
import { ShopResponse, ShopRequest } from '../types';
const shops = {
  // 가게 등록
  postShop: async (data: ShopRequest) => {
    return api.post<ShopResponse>('/shops', data);
  },
  // 가게 조회
  getShop: async (shop_id: string) => {
    return api.get<ShopResponse>(`/shops/${shop_id}`);
  },
  // 가게 정보 수정
  putShop: async (shop_id: string, data: ShopRequest) => {
    return api.put<ShopResponse>(`/shops/${shop_id}`, data);
  },
};
export default shops;
