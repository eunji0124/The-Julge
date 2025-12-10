import Post from '@/components/post/Post';
import { TransformedNotice } from '@/utils/transformNotice';

interface NoticeGridProps {
  notices: TransformedNotice[];
  onNoticeClick: (shopId: string, noticeId: string) => void;
}

const NoticeGrid = ({ notices, onNoticeClick }: NoticeGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 pb-10 sm:gap-4 lg:grid-cols-3 lg:gap-6">
      {notices.map((notice) => (
        <Post
          key={notice.id}
          {...notice}
          className="max-w-none"
          onClick={() => onNoticeClick(notice.shopId, notice.id)}
        />
      ))}
    </div>
  );
};

export default NoticeGrid;
