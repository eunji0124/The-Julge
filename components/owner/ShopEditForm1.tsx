"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import Input from "@/components/common/Input";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";
import ErrorModal from "@/components/common/modal/ErrorModal";

import { getMyShop, updateShop } from "@/api/shopEdit";
import { uploadImage } from "@/api/uploadImage"; //  등록 페이지와 동일한 방식 사용

const ADDRESS_OPTIONS = [
  "서울시 종로구","서울시 중구","서울시 용산구","서울시 성동구","서울시 광진구",
  "서울시 동대문구","서울시 중랑구","서울시 성북구","서울시 강북구","서울시 도봉구",
  "서울시 노원구","서울시 은평구","서울시 서대문구","서울시 마포구","서울시 양천구",
  "서울시 강서구","서울시 구로구","서울시 금천구","서울시 영등포구","서울시 동작구",
  "서울시 관악구","서울시 서초구","서울시 강남구","서울시 송파구","서울시 강동구",
];

const CATEGORY_OPTIONS = [
  "한식","중식","일식","양식","분식","카페","편의점","기타"
];

export default function ShopEditForm() {
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [hourlyPay, setHourlyPay] = useState("");
  const [description, setDescription] = useState("");

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  const [file, setFile] = useState<File | null>(null);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 기존 가게 정보 불러오기
  useEffect(() => {
    async function fetchShop() {
      try {
        const shop = await getMyShop();

        setName(shop.name);
        setCategory(shop.category);
        setAddress1(shop.address1);
        setAddress2(shop.address2 || "");
        setHourlyPay(String(shop.originalHourlyPay));
        setDescription(shop.description || "");

        setImageUrl(shop.imageUrl || "");
        setPreviewUrl(shop.imageUrl || null);
      } catch (e) {
        console.error("가게 정보 가져오기 오류:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchShop();
  }, []);

  if (loading) return <p className="p-10 text-center">불러오는 중...</p>;

  
  const handleSubmit = async () => {
    try {
      let finalImageUrl = imageUrl;

      // 이미지 변경이 있었다면 → 업로드 실행
      if (file) {
        finalImageUrl = await uploadImage(file);
        setImageUrl(finalImageUrl);
      }

      await updateShop({
        name,
        category,
        address1,
        address2,
        originalHourlyPay: Number(hourlyPay),
        description,
        imageUrl: finalImageUrl, 
      });

      setIsModalOpen(true);
    } catch (err) {
      console.error("❌ 가게 수정 오류:", err);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[820px] pt-24 py-12 px-6 sm:px-8 md:px-0">
      <h2 className="text-xl font-semibold mb-8">가게 정보 편집</h2>

      {/* 이름 + 카테고리 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Input label="가게 이름" value={name} onChange={setName} />

        <div className="relative">
          <Input
            type="select"
            label="분류"
            placeholder="선택"
            value={category}
            onToggleDropdown={() => setIsCategoryOpen(!isCategoryOpen)}
            isDropdownOpen={isCategoryOpen}
          />

          {isCategoryOpen && (
            <Dropdown
              items={CATEGORY_OPTIONS}
              selected={category}
              onSelect={(v) => {
                setCategory(v);
                setIsCategoryOpen(false);
              }}
              onClose={() => setIsCategoryOpen(false)}
            />
          )}
        </div>
      </div>

      {/* 주소 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="relative">
          <Input
            type="select"
            label="주소"
            placeholder="선택"
            value={address1}
            onToggleDropdown={() => setIsAddressOpen(!isAddressOpen)}
            isDropdownOpen={isAddressOpen}
          />

          {isAddressOpen && (
            <Dropdown
              items={ADDRESS_OPTIONS}
              selected={address1}
              onSelect={(v) => {
                setAddress1(v);
                setIsAddressOpen(false);
              }}
              onClose={() => setIsAddressOpen(false)}
            />
          )}
        </div>

        <Input label="상세 주소" value={address2} onChange={setAddress2} />
      </div>

      {/* 시급 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Input
          type="number"
          label="기본 시급"
          value={hourlyPay}
          onChange={setHourlyPay}
          unit="원"
        />
      </div>

      {/* 이미지 */}
      <div className="mb-8">
        <p className="mb-2 font-medium">가게 이미지</p>

        <div className="flex flex-col items-center justify-center h-[260px] w-full border border-gray-300 rounded-md bg-gray-100 relative overflow-hidden">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="preview"
              width={500}
              height={260}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="text-gray-500 text-sm flex flex-col items-center">
              <Image
                src="/images/camera.png"
                alt="camera"
                width={40}
                height={40}
                className="opacity-60 mb-2"
              />
              이미지 변경하기
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (!selected) return;

              setFile(selected);
              setPreviewUrl(URL.createObjectURL(selected));
              setImageUrl(""); 
            }}
          />
        </div>
      </div>

      {/* 설명 */}
      <div className="mb-10">
        <label className="block mb-2 font-medium">가게 설명</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-[160px] border border-gray-300 rounded-md p-3 resize-none"
        />
      </div>

      {/* 버튼 */}
      <div className="flex justify-center">
        <Button
          variant="primary"
          size="large"
          className="!max-w-[250px] !h-[50px] text-white text-lg"
          onClick={handleSubmit}
        >
          수정하기
        </Button>
      </div>

      {isModalOpen && (
        <ErrorModal
          message="수정이 완료되었습니다."
          onClose={() => {
            setIsModalOpen(false);
            window.location.href = "/owner/my-shop";
          }}
        />
      )}
    </div>
  );
}
