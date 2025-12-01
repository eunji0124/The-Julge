"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import users from "@/api/users";

export default function RedirectMyShopPage() {
  const router = useRouter();

  useEffect(() => {
    const fetch = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("로그인이 필요합니다.");
        router.push("/login");
        return;
      }

      // 유저 정보 조회
      const userRes = await users.getUser(userId);
      const shopItem = userRes?.item?.shop?.item;

      if (!shopItem) {
        // 가게 없는 경우 등록 페이지로 이동
        router.push("/owner/shop-register");
        return;
      }

      // 가게가 있으면 해당 shopId 페이지로 이동
      router.push(`/owner/shops/${shopItem.id}`);
    };

    fetch();
  }, []);

  return <div>내 가게 정보를 불러오는 중...</div>;
}
