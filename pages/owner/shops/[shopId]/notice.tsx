import { useState, useEffect, useRef } from 'react';

import { useRouter } from 'next/router';

import { toast } from 'react-toastify';

import noticesApi from '@/api/owner/notice';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import BadgeClose from '@/components/icons/BadgeClose';

const PostNotice = () => {
  const [hourlyPay, setHourlyPay] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [workhour, setWorkhour] = useState('');
  const [description, setDescription] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const { shopId } = router.query;

  // 로그인 체크 및 shopId 확인
  useEffect(() => {
    const checkAuth = () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.push('/login');
        return;
      }
    };
    checkAuth();
  }, [router]);

  // shopId가 없으면 로딩 상태 표시
  if (!shopId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        로딩중...
      </div>
    );
  }

  const getTodayDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // 자동 높이 조절
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // 입력 "YYYY-MM-DD HH:mm" → "YYYY-MM-DDTHH:mm:00Z" 로 변환
  const toISOZ = (dateStr: string) => {
    const [date, time] = dateStr.split(' ');
    return `${date}T${time}:00.000Z`;
  };

  const handleSubmit = async () => {
    if (!hourlyPay || !startsAt || !workhour) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }
    // 날짜 형식 검증
    const datePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    if (!datePattern.test(startsAt)) {
      toast.error('시작 시간 형식이 올바르지 않습니다. (예: 2025-12-23 13:00)');
      return;
    }

    try {
      const payload = {
        hourlyPay: Number(hourlyPay),
        startsAt: toISOZ(startsAt),
        workhour: Number(workhour),
        description,
      };

      await noticesApi.postShopNotice(shopId as string, payload);
      toast.success('공고가 등록되었습니다!');
      router.push(`/owner/shops/${shopId}`);
    } catch (e) {
      console.error(e);
      toast.error('등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center px-4 py-10 md:px-8 md:py-16">
      {/* 상단 제목 + 닫기 버튼 */}
      <div className="mb-8 flex w-full max-w-[964px] items-center justify-between">
        <h1 className="text-2xl font-bold md:text-[28px]">공고 등록</h1>
        <div
          onClick={() => router.push(`/owner/shops/${shopId}`)}
          className="h-8 w-8 flex-shrink-0 cursor-pointer">
          <BadgeClose />
        </div>
      </div>

      {/* 3개 입력 영역 */}
      <div className="mb-6 grid w-full max-w-[964px] grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div className="w-full">
          <Input
            type="number"
            label="시급*"
            value={hourlyPay}
            onChange={setHourlyPay}
            unit="원"
            placeholder="시급을 입력하세요"
          />
        </div>
        <div className="w-full">
          <Input
            type="text"
            label="시작 시간*"
            value={startsAt}
            onChange={setStartsAt}
            placeholder={getTodayDateTime()}
          />
        </div>
        <div className="w-full md:col-span-2 lg:col-span-1">
          <Input
            type="number"
            label="근무 시간*"
            value={workhour}
            onChange={setWorkhour}
            placeholder="근무 시간을 입력하세요"
            unit="시간"
          />
        </div>
      </div>

      {/* 설명 입력 필드 - 자동 높이 조절 */}
      <div className="mb-6 w-full max-w-[964px]">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          설명
        </label>
        <textarea
          ref={textareaRef}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            adjustTextareaHeight();
          }}
          placeholder="공고 설명을 입력하세요"
          rows={4}
          className="focus:border-blue-20 w-full resize-none overflow-hidden rounded-md border border-gray-300 px-4 py-3 transition-colors outline-none focus:outline-none"
        />
      </div>

      {/* 등록 버튼 */}
      <div className="w-full max-w-[312px]">
        <Button onClick={handleSubmit} className="h-12 w-full max-w-none!">
          등록하기
        </Button>
      </div>
    </div>
  );
};

export default PostNotice;
