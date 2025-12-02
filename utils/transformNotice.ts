import { NoticeItem } from '@/api/notices';

/**
 * 컴포넌트에서 사용하는 변환된 공고 타입
 */
export interface TransformedNotice {
  id: string;
  shopId: string;
  name: string;
  startAt: string;
  workTime: number;
  location: string;
  wage: number;
  imageUrl: string;
  isActive: boolean;
  percentage: number;
  description?: string;
}

/**
 * API 응답 공고를 컴포넌트용 형태로 변환
 */
export const transformNoticeData = (notice: NoticeItem): TransformedNotice => {
  const originalPay = notice.shop.item.originalHourlyPay;
  const currentPay = notice.hourlyPay;
  const percentage =
    originalPay > 0
      ? Math.round(((currentPay - originalPay) / originalPay) * 100)
      : 0;

  return {
    id: notice.id,
    shopId: notice.shop.item.id,
    name: notice.shop.item.name,
    startAt: notice.startsAt,
    workTime: notice.workhour,
    location: `${notice.shop.item.address1} ${notice.shop.item.address2}`,
    wage: notice.hourlyPay,
    imageUrl: notice.shop.item.imageUrl,
    isActive: !notice.closed,
    percentage,
    description: notice.description,
  };
}

export const calculatePercentage = (
  currentPay: number,
  originalPay: number
): number | undefined => {
  if (!originalPay || originalPay <= 0) return undefined;
  const percentage = Math.round(
    ((currentPay - originalPay) / originalPay) * 100
  );
  return percentage > 0 ? percentage : undefined;
};
