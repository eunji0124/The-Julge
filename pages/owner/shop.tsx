// pages/owner/shop.tsx
"use client";

import { useState } from "react";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";
import ShopImageUpload from "@/components/owner/ShopImageUpload";
import { registerShop } from "@/api/shopRegister";

export default function ShopPage() {
  const categories = ["한식", "중식", "일식", "양식", "분식", "카페", "편의점", "기타"];
  const addressOptions = [
    "서울시 종로구",
    "서울시 중구",
    "서울시 용산구",
    "서울시 성동구",
    "서울시 광진구",
    "서울시 동대문구",
    "서울시 중랑구",
    "서울시 성북구",
    "서울시 강북구",
    "서울시 도봉구",
    "서울시 노원구",
    "서울시 은평구",
    "서울시 서대문구",
    "서울시 마포구",
    "서울시 양천구",
    "서울시 강서구",
    "서울시 구로구",
    "서울시 금천구",
    "서울시 영등포구",
    "서울시 동작구",
    "서울시 관악구",
    "서울시 서초구",
    "한국시 강남구",
    "서울시 송파구",
    "서울시 강동구",
  ];

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [hourlyPay, setHourlyPay] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async () => {
    if (!name || !category || !address1 || !hourlyPay || !imageUrl) {
      alert("필수 값을 입력해주세요!");
      return;
    }

    try {
      const data = {
        name,
        category,
        address1,
        address2,
        hourlyPay: Number(hourlyPay),
        description,
        imageUrl,
      };

      const res = await registerShop(data);

      alert("가게 등록이 완료되었습니다!");
      console.log("등록 결과:", res);
    } catch (err) {
      console.error(err);
      alert("가게 등록 중 오류가 발생했습니다!");
    }
  };

  return (
    <div className="mx-auto max-w-[964px] px-6 py-10">
      <h1 className="text-[28px] font-bold mb-10">가게 정보 등록</h1>

      {/* 가게 이름 */}
      <div className="mb-6">
        <p className="mb-2 font-semibold">가게 이름</p>
        <input
          className="border w-full p-3 rounded"
          placeholder="가게 이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* 카테고리 */}
      <div className="mb-6">
        <Dropdown
          items={categories}
          selected={category}
          onSelect={setCategory}
        />
      </div>

      {/* 주소 */}
      <div className="flex gap-4 mb-6">
        <Dropdown
          items={addressOptions}
          selected={address1}
          onSelect={setAddress1}
        />
        <input
          className="border flex-1 p-3 rounded"
          placeholder="상세 주소 입력"
          value={address2}
          onChange={(e) => setAddress2(e.target.value)}
        />
      </div>

      {/* 시급 */}
      <div className="mb-6">
        <p className="mb-2 font-semibold">기본 시급</p>
        <input
          className="border w-full p-3 rounded"
          type="number"
          placeholder="12000"
          value={hourlyPay}
          onChange={(e) => setHourlyPay(e.target.value)}
        />
      </div>

      {/* 이미지 업로드 */}
      <div className="mb-6">
        <ShopImageUpload
          imageUrl={imageUrl}
          onChangeImage={setImageUrl}
        />
      </div>

      {/* 설명 */}
      <div className="mb-8">
        <p className="mb-2 font-semibold">가게 설명</p>
        <textarea
          className="border w-full p-3 rounded"
          rows={4}
          placeholder="가게 설명을 입력하세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <Button className="w-full h-[47px]" onClick={handleSubmit}>
        등록하기
      </Button>
    </div>
  );
}
