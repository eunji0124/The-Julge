import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { fetchNoticeList } from '@/api/notices';
import { useRecentNotices } from '@/hooks/useRecentNotices';
import {
  transformNoticeData,
  TransformedNotice,
} from '@/utils/transformNotice';

interface Props {
  className?: string;
}

const RecentViewedList = ({ className }: Props) => {
  const recentNotices = useRecentNotices();
  const [recentList, setRecentList] = useState<TransformedNotice[]>([]);

  useEffect(() => {
    if (recentNotices.length === 0) {
      setRecentList([]);
      return;
    }

    const fetchRecent = async () => {
      try {
        const listResponse = await fetchNoticeList({
          offset: 0,
          limit: 100,
        });

        const foundNotices = recentNotices
          .map((recentItem) => {
            const found = listResponse.items.find(
              ({ item }) => item.id === recentItem.id
            );
            return found ? transformNoticeData(found.item) : null;
          })
          .filter((item): item is TransformedNotice => item !== null);

        setRecentList(foundNotices);
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
            href={`/auth/shops/${notice.shopId}/notices/${notice.id}`}
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
