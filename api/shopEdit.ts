// api/shopEdit.ts

import { api } from './client';
import { ShopResponse } from './types';

export const getMyShop = async (shopId: string) => {
  const response = await api.get<ShopResponse>(`/shops/${shopId}`);
  return response;
};

export const updateShop = async (shopId: string, data: unknown) => {
  return api.put(`/shops/${shopId}`, data);
};
