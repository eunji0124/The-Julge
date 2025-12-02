// api/shopEdit.ts

import axios from "axios";

export const getMyShop = async () => {
  const token = localStorage.getItem("auth-token") || "";
  const res = await axios.get(
    "https://bootcamp-api.codeit.kr/api/0-1/the-julge/shops/me",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const updateShop = async (data: any) => {
  const token = localStorage.getItem("auth-token") || "";
  const res = await axios.put(
    "https://bootcamp-api.codeit.kr/api/0-1/the-julge/shops",
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
