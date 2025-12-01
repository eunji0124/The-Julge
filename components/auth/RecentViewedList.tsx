import Image from 'next/image';
import Link from 'next/link';

import { NoticeItem } from '@/api/notices';

interface RecentItem {
  item: NoticeItem;
}

interface Props {
  className?: string;
}

const RecentViewedList = ({ className }: Props) => {
  const recent: RecentItem[] =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('recentNotices') || '[]')
      : [];

  if (!recent.length) return null;

  return (
    <section className={className}>
      <h3 className="mb-4 text-lg font-bold">최근에 본 공고</h3>

      <div className="grid grid-cols-3 gap-4">
        {recent.map(({ item }) => (
          <Link
            href={`/notices/${item.id}`}
            key={item.id}
            className="overflow-hidden rounded-xl bg-white shadow">
            <Image
              src={item.shop.item.imageUrl}
              alt={item.shop.item.name}
              width={300}
              height={200}
              className="h-32 w-full object-cover"
            />

            <div className="p-3 text-sm">{item.shop.item.name}</div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecentViewedList;
