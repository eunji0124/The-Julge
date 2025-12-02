'use client';

import { useState } from 'react';

import Image from 'next/image';

import { registerShop } from '@/api/shopRegister';
import { uploadImage } from '@/api/uploadImage';
import Button from '@/components/common/Button';
import Dropdown from '@/components/common/Dropdown';
import Input from '@/components/common/Input';
import ErrorModal from '@/components/common/modal/ErrorModal';

const ADDRESS_OPTIONS = [
  '서울시 종로구',
  '서울시 중구',
  '서울시 용산구',
  '서울시 성동구',
  '서울시 광진구',
  '서울시 동대문구',
  '서울시 중랑구',
  '서울시 성북구',
  '서울시 강북구',
  '서울시 도봉구',
  '서울시 노원구',
  '서울시 은평구',
  '서울시 서대문구',
  '서울시 마포구',
  '서울시 양천구',
  '서울시 강서구',
  '서울시 구로구',
  '서울시 금천구',
  '서울시 영등포구',
  '서울시 동작구',
  '서울시 관악구',
  '서울시 서초구',
  '서울시 강남구',
  '서울시 송파구',
  '서울시 강동구',
];

const CATEGORY_OPTIONS = [
  '한식',
  '중식',
  '일식',
  '양식',
  '분식',
  '카페',
  '편의점',
  '기타',
];

const ShopRegisterForm = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [hourlyPay, setHourlyPay] = useState('');
  const [description, setDescription] = useState('');

  // 이미지 관련
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //

  const handleSubmit = async () => {
    if (!name || !category || !address1 || !hourlyPay) {
      alert('필수 항목을 입력해주세요.');
      return;
    }

    try {
      let uploadedImageUrl = imageUrl;

      // 이미지 선택 시
      if (file) {
        uploadedImageUrl = await uploadImage(file);
        setImageUrl(uploadedImageUrl);
      }

      // 가게 등록 API 호출
      await registerShop({
        name,
        category,
        address1,
        address2: address2 || '',
        description: description || '',
        originalHourlyPay: Number(hourlyPay),
        imageUrl: uploadedImageUrl,
      });

      setIsModalOpen(true);
    } catch (err) {
      console.error('가게등록 오류:', err);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[820px] px-6 py-12 pt-24 sm:px-8 md:px-0">
      {/* 이름 + 카테고리 */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          label="가게 이름"
          placeholder="입력"
          value={name}
          onChange={setName}
        />

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
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
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

        <Input
          label="상세 주소"
          placeholder="입력"
          value={address2}
          onChange={setAddress2}
        />
      </div>

      {/* 시급 */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          type="number"
          label="기본 시급"
          placeholder="10000"
          value={hourlyPay}
          onChange={setHourlyPay}
          unit="원"
        />
      </div>

      {/* 이미지 업로드 */}
      <div className="mb-8">
        <p className="mb-2 font-medium">가게 이미지</p>

        <div className="relative flex h-[260px] w-full flex-col items-center justify-center overflow-hidden rounded-md border border-gray-300 bg-gray-100">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="preview"
              width={500}
              height={260}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center text-sm text-gray-500">
              <Image
                src="/images/camera.png"
                alt="camera"
                width={40}
                height={40}
                className="mb-2 opacity-60"
              />
              이미지 추가하기
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;

              setFile(f);
              setPreviewUrl(URL.createObjectURL(f));
              setImageUrl('');
            }}
          />
        </div>
      </div>

      {/* 설명 */}
      <div className="mb-10">
        <label className="mb-2 block font-medium">가게 설명</label>
        <textarea
          placeholder="가게 소개를 입력하세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-[160px] w-full resize-none rounded-md border border-gray-300 p-3"
        />
      </div>

      {/* 버튼 */}
      <div className="flex justify-center">
        <Button
          variant="primary"
          size="large"
          className="!h-[50px] !max-w-[250px] text-lg text-white"
          onClick={handleSubmit}>
          등록하기
        </Button>
      </div>

      {isModalOpen && (
        <ErrorModal
          message="등록이 완료되었습니다."
          onClose={() => {
            setIsModalOpen(false);
            window.location.href = '/owner/shops';
          }}
        />
      )}
    </div>
  );
};

export default ShopRegisterForm;
