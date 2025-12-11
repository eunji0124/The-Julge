import PostBannerUser from '@/components/post/PostBannerUser';
import { ApplicationStatus } from '@/types/application';
import { TransformedNotice } from '@/utils/transformNotice';

interface NoticeDetailContentProps {
  notice: TransformedNotice;
  applicationStatus: ApplicationStatus;
  onApply: () => void;
  onCancel: () => void;
}

const NoticeDetailContent = ({
  notice,
  applicationStatus,
  onApply,
  onCancel,
}: NoticeDetailContentProps) => {
  return (
    <>
      {/* 상단 카테고리 & 제목 */}
      <div className="bg-white pt-15">
        <div className="mx-auto max-w-[964px] px-3 sm:px-8 lg:px-0">
          <p className="mb-2 text-[14px] leading-[22px] font-bold text-[#FF5C3F]">
            식당
          </p>
          <h1 className="text-[20px] leading-8 font-bold text-black sm:text-[28px] sm:leading-9">
            {notice.name}
          </h1>
        </div>
      </div>

      {/* PostBannerUser 영역 */}
      <div className="bg-white pt-6">
        <div className="flex justify-center px-3 sm:px-8 lg:px-0">
          <PostBannerUser
            name={notice.name}
            startAt={notice.startAt}
            workTime={notice.workTime}
            location={notice.location}
            wage={notice.wage}
            imageUrl={notice.imageUrl}
            percentage={notice.percentage}
            description={notice.description || '공고 설명입니다.'}
            isActive={notice.isActive}
            applicationStatus={applicationStatus}
            onApply={onApply}
            onCancel={onCancel}
          />
        </div>
      </div>

      {/* 공고 설명 */}
      <div className="bg-white px-3 pt-6 pb-15 sm:px-8 lg:px-0">
        <div className="bg-gray-10 mx-auto max-w-[964px] rounded-xl px-9 py-9 sm:px-8 lg:px-9 lg:py-9">
          <h2 className="mb-2 text-[20px] leading-8 font-bold text-black">
            공고 설명
          </h2>
          <p className="text-[14px] leading-[22px] whitespace-pre-wrap text-black sm:text-[16px] sm:leading-[26px]">
            {notice.description || '공고 설명입니다.'}
          </p>
        </div>
      </div>
    </>
  );
};

export default NoticeDetailContent;
