'use client';

import { useEffect, useState } from "react";
import ShopEditForm from "@/components/owner/ShopEditForm";
import axios from "axios";

const ShopEditPage = () => {
  const [shop, setShop] = useState<any>(null);

  const fetchMyShop = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.get(
        "https://bootcamp-api.codeit.kr/api/0-1/the-julge/shops/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShop(res.data);
    } catch (err) {
      console.error("가게 정보 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchMyShop();
  }, []);

  if (!shop) return <div className="p-10">불러오는 중...</div>;

  return <ShopEditForm shop={shop} />;
};

export default ShopEditPage;
