import { api } from './client';

export interface RegisterShopRequest {
  name: string;
  category: string;
  address1: string;
  address2?: string;
  description?: string;
  imageUrl?: string;
  originalHourlyPay: number;
}

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.post<{ url: string }>("/images/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.url;
};

const shops = {
  register: (data: RegisterShopRequest) => api.post("/shops", data),
};

export { shops };
export default shops;
