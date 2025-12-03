import { NoticeItem } from '@/apis/notices';

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
  percentage?: number;
  description?: string;
}

/**
 * API 응답 공고를 컴포넌트용 형태로 변환
 */
export const transformNoticeData = (notice: NoticeItem): TransformedNotice => {
  const originalPay = notice.shop.item.originalHourlyPay;
  const currentPay = notice.hourlyPay;
  let percentage: number | undefined = undefined;

  if (originalPay > 0) {
    const diff = Math.round(((currentPay - originalPay) / originalPay) * 100);

    // 인상률이 양수일 때만 노출
    if (diff > 0) {
      percentage = diff;
    }
  }
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
};

export const calculatePercentage = (
  currentPay: number,
  originalPay: number
): number | undefined => {
  if (!originalPay || originalPay <= 0) return undefined;

  const diff = Math.round(((currentPay - originalPay) / originalPay) * 100);

  return diff > 0 ? diff : undefined;
};
