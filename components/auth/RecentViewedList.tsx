import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { fetchNoticeDetail } from '@/api/notices';
import { useRecentNotices } from '@/hooks/useRecentNotices';
import {
  transformNoticeData,
  TransformedNotice,
} from '@/utils/transformNotice';

interface Props {
  className?: string;
}

const RecentViewedList = ({ className }: Props) => {
  const recentNotices = useRecentNotices(); // 최대 6개까지 관리
  const [recentList, setRecentList] = useState<TransformedNotice[]>([]);

  useEffect(() => {
    if (!recentNotices.length) {
      setRecentList([]);
      return;
    }

    const fetchRecent = async () => {
      try {
        // Promise.allSettled를 사용하여 개별 실패 처리
        const results = await Promise.allSettled(
          recentNotices.map(({ shopId, id }) =>
            fetchNoticeDetail(shopId, id).then((res) =>
              transformNoticeData(res.item)
            )
          )
        );

        // 성공한 결과만 필터링
        const successfulNotices = results
          .filter(
            (result): result is PromiseFulfilledResult<TransformedNotice> =>
              result.status === 'fulfilled'
          )
          .map((result) => result.value);

        // 실패한 요청 로깅 (디버깅용)
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.warn(
              `공고 로딩 실패 (shopId: ${recentNotices[index].shopId}, noticeId: ${recentNotices[index].id}):`,
              result.reason
            );
          }
        });

        setRecentList(successfulNotices);
      } catch (error) {
        console.error('최근 본 공고 로딩 실패:', error);
        setRecentList([]);
      }
    };

    fetchRecent();
  }, [recentNotices]);

  if (!recentList.length) return null;

  return (
    <section className={className}>
      <h3 className="mb-4 text-lg font-bold">최근에 본 공고</h3>

      <div className="grid grid-cols-3 gap-4">
        {recentList.map((notice) => (
          <Link
            href={`/staff/shops/${notice.shopId}/notices/${notice.id}`}
            key={notice.id}
            className="overflow-hidden rounded-xl bg-white shadow">
            <Image
              src={notice.imageUrl}
              alt={notice.name}
              width={300}
              height={200}
              className="h-32 w-full object-cover"
            />

            <div className="p-3 text-sm">{notice.name}</div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecentViewedList;
