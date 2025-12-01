'use client';

import { useState } from 'react';
import Image from 'next/image';

import Input from '@/components/common/Input';
import Dropdown from '@/components/common/Dropdown';
import Button from '@/components/common/Button';
import ConfirmModal from '@/components/common/modal/ConfirmModal';
import ErrorModal from '@/components/common/modal/ErrorModal';

import { registerShop } from '@/api/shopRegister';

const ADDRESS_OPTIONS = [
  '서울시 종로구','서울시 중구','서울시 용산구','서울시 성동구','서울시 광진구',
  '서울시 동대문구','서울시 중랑구','서울시 성북구','서울시 강북구','서울시 도봉구',
  '서울시 노원구','서울시 은평구','서울시 서대문구','서울시 마포구','서울시 양천구',
  '서울시 강서구','서울시 구로구','서울시 금천구','서울시 영등포구','서울시 동작구',
  '서울시 관악구','서울시 서초구','서울시 강남구','서울시 송파구','서울시 강동구',
];

const CATEGORY_OPTIONS = ['한식', '중식', '일식', '양식', '분식', '카페', '편의점', '기타'];

const ShopRegisterForm = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [hourlyPay, setHourlyPay] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async () => {
    if (!name || !category || !address1 || !hourlyPay) {
      alert('필수 항목을 입력해주세요.');
      return;
    }

    try {
      await registerShop({
        name,
        category,
        address1,
        address2,
        hourlyPay: Number(hourlyPay),
        description,
        imageUrl,
      });

      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      setIsModalOpen(true);
    }
  };

  return (
    <div
      className="
        mx-auto 
        w-full 
        max-w-[820px] 
        pt-24
        py-12
        px-6         /* 🔥 모바일 좌우 여백 */
        sm:px-8      /* 태블릿 */
        md:px-0      /* 데스크탑 */
      "
    >
      {/* -------------------------------
          🔥 1줄: 가게 이름 + 분류
      -------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Input label="가게 이름" placeholder="입력" value={name} onChange={setName} />

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

      {/* -------------------------------
          🔥 2줄: 주소 + 상세주소
      -------------------------------- */}
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

        <Input label="상세 주소" placeholder="입력" value={address2} onChange={setAddress2} />
      </div>

      {/* -------------------------------
          🔥 3줄: 기본 시급
      -------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Input
          type="number"
          label="기본 시급"
          placeholder="10000"
          value={hourlyPay}
          onChange={setHourlyPay}
          unit="원"
        />
      </div>

      {/* -------------------------------
          🔥 이미지 업로드
      -------------------------------- */}
      <div className="mb-8">
        <p className="mb-2 font-medium">가게 이미지</p>

        <div
          className="
            flex flex-col items-center justify-center 
            h-[260px] w-full 
            border border-gray-300 rounded-md 
            bg-gray-100 
            relative overflow-hidden
          "
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="미리보기"
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
              이미지 추가하기
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const previewUrl = URL.createObjectURL(file);
              setImageUrl(previewUrl);
            }}
          />
        </div>
      </div>

      {/* -------------------------------
          🔥 가게 소개
      -------------------------------- */}
      <div className="mb-10">
        <label className="block mb-2 font-medium">가게 설명</label>
        <textarea
          placeholder="가게 소개를 입력하세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-[160px] border border-gray-300 rounded-md p-3 resize-none"
        />
      </div>

      {/* -------------------------------
          🔥 등록 버튼
      -------------------------------- */}
      <div className="flex justify-center">
        <Button
          variant="primary"
          size="large"
          className="!max-w-[250px] !h-[50px] text-white text-lg"
          onClick={handleSubmit}
        >
          등록하기
        </Button>
      </div>

      {/* -------------------------------
          🔥 ConfirmModal
      -------------------------------- */}
      {/* 모달 */}
{isModalOpen && (
  <ErrorModal
    message="등록이 완료되었습니다."
    onClose={() => {
      setIsModalOpen(false);
      window.location.href = '/owner/my-shop';
    }}
  />
)}

    </div>
  );
};

export default ShopRegisterForm;
