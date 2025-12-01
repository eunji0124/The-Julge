// api/shopRegister.ts
import axios from "axios";

export interface RegisterShopDto {
  name: string;
  category: string;
  address1: string;
  address2?: string;
  hourlyPay: number;
  description?: string;
  imageUrl?: string;
}

const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};


export const registerShop = async (data: RegisterShopDto) => {
  const token = getAccessToken();

  const res = await axios.post(
    "https://bootcamp-api.codeit.kr/api/0-1/the-julge/shops",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

