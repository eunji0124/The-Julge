import Post from '@/components/post/Post';
import { useCustomNotices } from '@/hooks/useCustomNotices';

interface CustomNoticeSectionProps {
  onNoticeClick: (shopId: string, noticeId: string) => void;
}

const CustomNoticeSection = ({ onNoticeClick }: CustomNoticeSectionProps) => {
  const { notices } = useCustomNotices();

  return (
    <section className="bg-red-10 mb-16 px-3 py-10 sm:px-8 sm:pt-15 lg:py-15">
      <div className="mx-auto max-w-[964px]">
        <h2 className="mb-6 px-4 text-[20px] font-bold text-black sm:px-0 sm:text-[28px]">
          맞춤 공고
        </h2>
        {notices.length > 0 ? (
          <>
            {/* 모바일/태블릿: 가로 스크롤 */}
            <div className="overflow-x-auto px-4 sm:px-0 lg:hidden">
              <div className="flex gap-3 sm:gap-4">
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="w-[calc(50vw-24px)] shrink-0 sm:w-[calc(50vw-32px)]">
                    <Post
                      {...notice}
                      className="max-w-none"
                      onClick={() => onNoticeClick(notice.shopId, notice.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* 데스크탑: 그리드 */}
            <div className="hidden grid-cols-3 gap-6 lg:grid">
              {notices.map((notice) => (
                <Post
                  key={notice.id}
                  {...notice}
                  className="max-w-none"
                  onClick={() => onNoticeClick(notice.shopId, notice.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="py-10 text-center">
            <p className="text-gray-500">맞춤 공고가 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomNoticeSection;
