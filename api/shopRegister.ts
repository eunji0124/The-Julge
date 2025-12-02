// api/shopRegister.ts

import axios from "axios";

export interface RegisterShopDto {
  name: string;
  category: string;
  address1: string;
  address2?: string;
  description?: string;
  imageUrl: string;  // 빈 문자열 가능
  originalHourlyPay: number;
}

export const registerShop = async (data: RegisterShopDto) => {
  // 🔥 1) auth-token에서 JWT만 추출
  let token = "";
  const raw = localStorage.getItem("auth-token");

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      token = parsed?.state?.token || "";
    } catch (e) {
      console.error("토큰 파싱 오류:", e);
    }
  }

  // 🔥 2) 올바른 JWT만 Authorization에 넣기
  const res = await axios.post(
    "https://bootcamp-api.codeit.kr/api/0-1/the-julge/shops",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`, // ← 이제 정상 토큰만 들어감
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
};
