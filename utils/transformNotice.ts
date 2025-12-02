// utils/transformNotice.ts
import { NoticeItem } from '@/api/notices';

export interface TransformedNotice {
  id: string;
  name: string;
  startAt: string;
  workTime: number;
  location: string;
  wage: number;
  imageUrl: string;
  isActive: boolean;
  percentage?: number;
}

export function transformNoticeData(item: NoticeItem): TransformedNotice {
  const { shop, hourlyPay, startsAt, workhour, closed } = item;
  const originalPay = shop.item.originalHourlyPay;

  // 시급 인상률 계산
  const percentage =
    originalPay > 0
      ? Math.round(((hourlyPay - originalPay) / originalPay) * 100)
      : 0;

  return {
    id: item.id,
    name: shop.item.name,
    startAt: startsAt,
    workTime: workhour,
    location: `${shop.item.address1} ${shop.item.address2}`,
    wage: hourlyPay,
    imageUrl: shop.item.imageUrl,
    isActive: !closed, // closed가 false면 활성화
    percentage: percentage > 0 ? percentage : undefined,
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
