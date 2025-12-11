import { useState, useEffect } from 'react';

import { fetchNoticeDetail } from '@/apis/notices';
import { addRecentNotice } from '@/hooks/useRecentNotices';
import { ApplicationState } from '@/types/application';
import {
  transformNoticeData,
  TransformedNotice,
} from '@/utils/transformNotice';

export const useNoticeDetail = (
  shopId?: string | string[],
  noticeId?: string | string[]
) => {
  const [noticeDetail, setNoticeDetail] = useState<TransformedNotice | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [applicationState, setApplicationState] = useState<ApplicationState>({
    status: 'none',
    applicationId: null,
  });

  useEffect(() => {
    if (!shopId || !noticeId) return;
    if (Array.isArray(shopId) || Array.isArray(noticeId)) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchNoticeDetail(
          String(shopId),
          String(noticeId)
        );
        const transformed = transformNoticeData(response.item);
        setNoticeDetail(transformed);
        addRecentNotice(String(shopId), String(noticeId));

        // 신청 상태 설정
        if (response.item.currentUserApplication) {
          const application = response.item.currentUserApplication.item;
          setApplicationState({
            status:
              application.status === 'accepted'
                ? 'approved'
                : application.status,
            applicationId: application.id,
          });
        }
      } catch (err) {
        console.error('공고 로딩 실패:', err);
        setNoticeDetail(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [shopId, noticeId]);

  return {
    noticeDetail,
    isLoading,
    applicationState,
    setApplicationState,
  };
};
