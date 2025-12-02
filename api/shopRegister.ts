// api/shopRegister.ts

import { api } from './client';

export interface RegisterShopDto {
  name: string;
  category: string;
  address1: string;
  address2?: string;
  description?: string;
  imageUrl: string; // 빈 문자열 가능
  originalHourlyPay: number;
}

export const registerShop = async (data: RegisterShopDto) => {
  return api.post('/shops', data);
};
