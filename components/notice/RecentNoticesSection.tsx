import Post from '@/components/post/Post';
import { TransformedNotice } from '@/utils/transformNotice';

interface RecentNoticesSectionProps {
  notices: TransformedNotice[];
  onNoticeClick: (shopId: string, noticeId: string) => void;
}

const RecentNoticesSection = ({
  notices,
  onNoticeClick,
}: RecentNoticesSectionProps) => {
  if (notices.length === 0) return null;

  return (
    <div className="mt-16 pb-20">
      <div className="mx-auto max-w-[964px] px-3 sm:px-8 lg:px-0">
        <h2 className="mb-6 text-[20px] leading-8 font-bold text-black sm:text-[28px] sm:leading-9">
          최근에 본 공고
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6">
          {notices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => onNoticeClick(notice.shopId, notice.id)}
              className="cursor-pointer">
              <Post
                name={notice.name}
                startAt={notice.startAt}
                workTime={notice.workTime}
                location={notice.location}
                wage={notice.wage}
                imageUrl={notice.imageUrl}
                isActive={notice.isActive}
                percentage={notice.percentage}
                className="max-w-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentNoticesSection;
