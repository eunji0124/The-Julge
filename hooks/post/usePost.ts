// hooks/post/usePost.ts
import { useMemo } from 'react';

import { formatWorkTime } from '@/lib/utils/formatWorkTime';

interface UsePostProps {
  startAt: string;
  workTime: number;
  isActive?: boolean;
}

export const usePost = ({
  startAt,
  workTime,
  isActive = true,
}: UsePostProps) => {
  const workInfo = useMemo(
    () => formatWorkTime(startAt, workTime),
    [startAt, workTime]
  );

  // 비활성화 상태이거나 지난 공고
  const isColor = isActive && !workInfo.isExpired;
  const overlayText = workInfo.isExpired ? '지난 공고' : '마감 완료';

  // Badge 색상
  const getBadgeColor = (percentage: number, isBackground = true) => {
    if (!isColor) return '';
    const levels = [
      { limit: 50, color: 'red-40' },
      { limit: 30, color: 'red-30' },
      { limit: 0, color: 'red-20' },
    ];
    const matched =
      levels.find((lv) => percentage >= lv.limit) ?? levels[levels.length - 1];

    return isBackground
      ? `bg-[var(--color-${matched.color})] text-white`
      : `text-[var(--color-${matched.color})]`;
  };

  return { workInfo, isColor, overlayText, getBadgeColor };
};
