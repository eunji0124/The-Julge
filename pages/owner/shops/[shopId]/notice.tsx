import { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';

import noticesApi from '@/api/owner/notice';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import BadgeClose from '@/components/icons/BadgeClose';

const PostNotice = () => {
  const [hourlyPay, setHourlyPay] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [workhour, setWorkhour] = useState('');
  const [description, setDescription] = useState('');
  const { shopId: paramShopId } = useParams<{ shopId: string }>();
  const [shopId, setShopId] = useState<string | undefined>(paramShopId);

  useEffect(() => {
    // 클라이언트에서만 실행
    if (typeof window !== 'undefined' && !shopId) {
      const pathname = window.location.pathname;
      const extractedShopId = pathname.split('/')[3];
      setShopId(extractedShopId);
    }
  }, [shopId]);

  // 입력 "YYYY-MM-DD HH:mm" → "YYYY-MM-DDTHH:mm:00Z" 로 변환
  const toISOZ = (dateStr: string) => {
    const [date, time] = dateStr.split(' ');
    return `${date}T${time}:00.000Z`;
  };

  const handleSubmit = async () => {
    if (!hourlyPay || !startsAt || !workhour) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }
    // 날짜 형식 검증
    const datePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    if (!datePattern.test(startsAt)) {
      alert('시작 시간 형식이 올바르지 않습니다. (예: 2025-12-23 13:00)');
      return;
    }

    try {
      const payload = {
        hourlyPay: Number(hourlyPay),
        startsAt: toISOZ(startsAt),
        workhour: Number(workhour),
        description,
      };

      const res = await noticesApi.postShopNotice(shopId, payload);
      console.log('등록 성공:', res);

      alert('공고가 등록되었습니다!');
    } catch (e) {
      console.error('등록 실패:', e);
      alert('등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center pt-25 pb-25">
      {/* 상단 제목 + 닫기 버튼 */}
      <div className="flex h-full w-[964px] items-center justify-between max-[744px]:w-[680px] max-[375px]:w-[351px]">
        <h1 className="text-[28px] font-bold">공고 등록</h1>
        <div className="h-8 w-8 cursor-pointer">
          <BadgeClose />
        </div>
      </div>
      {/* 3개 입력 영역 */}
      <div className="flex w-full justify-center">
        <div className="align-center mb-8 flex justify-center gap-5 max-[744px]:flex-wrap max-[744px]:justify-start">
          <div className="w-[308px] max-[744px]:w-[330px] max-[375px]:w-[351px]">
            <Input
              type="number"
              label="시급*"
              value={hourlyPay}
              onChange={setHourlyPay}
              unit="원"
              placeholder="시급을 입력하세요"
            />
          </div>
          <div className="w-[308px] max-[744px]:w-[330px] max-[375px]:w-[351px]">
            <Input
              type="text"
              label="시작 시간*"
              value={startsAt}
              onChange={setStartsAt}
              placeholder="2025-12-23 13:00"
            />
          </div>
          <div className="w-[308px] max-[744px]:w-[330px] max-[375px]:w-[351px]">
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
      </div>
      {/* 설명 입력 필드 */}
      <div className="mt-8 w-[964px] max-[744px]:w-[680px] max-[375px]:w-[351px]">
        <Input
          type="text"
          label="설명"
          value={description}
          onChange={setDescription}
          placeholder="공고 설명을 입력하세요"
        />
      </div>

      {/* 등록 버튼 */}
      <div className="mt-8 h-[48px] w-[312px]">
        <Button onClick={handleSubmit} className="h-full w-full max-w-none!">
          등록하기
        </Button>
      </div>
    </div>
  );
};

export default PostNotice;
