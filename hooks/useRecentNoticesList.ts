import { useState, useEffect, useMemo } from 'react';

import { fetchNoticeDetail } from '@/apis/notices';
import { useRecentNotices } from '@/hooks/useRecentNotices';
import {
  transformNoticeData,
  TransformedNotice,
} from '@/utils/transformNotice';

export const useRecentNoticesList = (currentNoticeId?: string | string[]) => {
  const recentNotices = useRecentNotices();
  const [noticesList, setNoticesList] = useState<TransformedNotice[]>([]);

  // 현재 공고 제외한 최근 본 공고 필터링
  const filteredRecentNotices = useMemo(() => {
    return recentNotices
      .filter((item) => item.id !== currentNoticeId)
      .slice(0, 6);
  }, [recentNotices, currentNoticeId]);

  useEffect(() => {
    if (filteredRecentNotices.length === 0) {
      setNoticesList([]);
      return;
    }

    const fetchNotices = async () => {
      try {
        const results = await Promise.allSettled(
          filteredRecentNotices.map(({ shopId, id }) =>
            fetchNoticeDetail(shopId, id).then((res) =>
              transformNoticeData(res.item)
            )
          )
        );

        const successfulNotices = results
          .filter(
            (result): result is PromiseFulfilledResult<TransformedNotice> =>
              result.status === 'fulfilled'
          )
          .map((result) => result.value);

        setNoticesList(successfulNotices);
      } catch (error) {
        console.error('최근 본 공고 로딩 실패:', error);
        setNoticesList([]);
      }
    };

    fetchNotices();
  }, [filteredRecentNotices]);

  return noticesList;
};
