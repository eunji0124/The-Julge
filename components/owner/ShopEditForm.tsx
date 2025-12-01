'use client';

import { useState } from "react";
import Input from "@/components/common/Input";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";
import ErrorModal from "@/components/common/modal/ErrorModal";
import axios from "axios";

const CATEGORY = ["한식", "중식", "일식", "양식", "분식", "카페", "편의점", "기타"];

const ShopEditForm = ({ shop }: { shop: any }) => {
  const [name, setName] = useState(shop.name);
  const [category, setCategory] = useState(shop.category);
  const [address1, setAddress1] = useState(shop.address1);
  const [address2, setAddress2] = useState(shop.address2 || "");
  const [hourlyPay, setHourlyPay] = useState(String(shop.hourlyPay));
  const [description, setDescription] = useState(shop.description || "");
  const [imageUrl, setImageUrl] = useState(shop.imageUrl || "");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateShop = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.put(
        `https://bootcamp-api.codeit.kr/api/0-1/the-julge/shops/${shop.id}`,
        {
          name,
          category,
          address1,
          address2,
          hourlyPay: Number(hourlyPay),
          description,
          imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[820px] py-20">

      <Input label="가게 이름" value={name} onChange={setName} />

      {/* 분류 */}
      <Dropdown
        items={CATEGORY}
        selected={category}
        onSelect={setCategory}
        onClose={() => {}}
      />

      {/* 주소 */}
      <Input label="주소" value={address1} onChange={setAddress1} />
      <Input label="상세 주소" value={address2} onChange={setAddress2} />

      <Input label="기본 시급" value={hourlyPay} onChange={setHourlyPay} />

      {/* 가게 소개 */}
      <textarea
        className="w-full h-[160px] border p-3 rounded-md"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Button className="mt-10" onClick={updateShop}>저장하기</Button>

      {isModalOpen && (
        <ErrorModal message="수정이 완료되었습니다." onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default ShopEditForm;
