import Tippy from '@tippyjs/react';

import { usePost } from '@/hooks/post/usePost';

import PostImage from './PostImage';
import PostLocation from './PostLocation';
import PostTime from './PostTime';
import PostWage from './PostWage';
import Button from '../common/Button';
import 'tippy.js/dist/tippy.css';

type ApplicationStatus =
  | 'none'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'canceled';

interface PostBannerUserProps {
  name: string;
  startAt: string;
  workTime: number;
  location: string;
  wage: number;
  imageUrl: string;
  percentage?: number;
  description: string;
  isActive?: boolean;
  applicationStatus?: ApplicationStatus;
  onApply?: () => void;
  onCancel?: () => void;
}

const PostBannerUser = ({
  name,
  startAt,
  workTime,
  location,
  wage,
  imageUrl,
  description,
  percentage,
  isActive = true,
  applicationStatus = 'none',
  onApply,
  onCancel,
}: PostBannerUserProps) => {
  const { workInfo, isColor, getBadgeColor } = usePost({
    startAt,
    workTime,
    isActive,
  });

  // 시작 시간이 현재보다 이전이면 기간 만료
  const isExpired = new Date(startAt) < new Date();

  // 버튼 상태 결정
  const getButtonConfig = () => {
    if (!isActive || isExpired) {
      return {
        text: '신청 불가',
        variant: 'primary' as const,
        disabled: true,
        onClick: undefined,
      };
    }

    // 신청 상태에 따른 버튼
    switch (applicationStatus) {
      case 'pending':
      case 'approved':
        // 신청 중이거나 승인된 경우
        return {
          text: '취소하기',
          variant: 'secondary' as const,
          disabled: false,
          onClick: onCancel,
        };
      case 'canceled':
      case 'rejected':
      case 'none':
      default:
        // 신청하지 않았거나 취소/거절된 경우
        return {
          text: '신청하기',
          variant: 'primary' as const,
          disabled: false,
          onClick: onApply,
        };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <div className="mx-auto flex w-[964px] gap-6 rounded-[12px] border border-[var(--color-gray-20)] bg-[var(--color-white)] p-6 max-[744px]:w-[680px] max-[744px]:flex-col max-[744px]:gap-4 max-[375px]:w-[351px] max-[375px]:gap-3 max-[375px]:p-5">
      {/* 이미지 영역 */}
      <div className="h-[312px] w-full max-w-[539px] max-[744px]:h-[360.858px] max-[744px]:max-w-full max-[375px]:h-[177.71px]">
        <PostImage imageUrl={imageUrl} name={name} isColor={isColor} />
      </div>

      {/* 정보 영역 */}
      <div className="flex w-[346px] flex-1 flex-col max-[744px]:w-full max-[375px]:w-full">
        {/* 내용 영역 */}
        <div className="flex-1 pt-4 max-[744px]:pt-0 max-[375px]:pt-0">
          <span className="text-[16px] leading-[20px] font-[700] text-[var(--color-red-50)] max-[375px]:text-[14px]">
            시급
          </span>
          <div className="h-[8px]" />
          <div className="w-[293px]">
            <PostWage
              wage={wage}
              percentage={percentage}
              isColor={isColor}
              getBadgeColor={getBadgeColor}
              size="md"
            />
          </div>

          <div className="h-[12px]" />
          <PostTime workInfo={workInfo} isColor={isColor} />
          <div className="h-[12px]" />
          <PostLocation location={location} isColor={isColor} size="md" />

          <Tippy
            trigger="mouseenter focus"
            content={description}
            placement="bottom"
            arrow={true}
            animation="scale"
            duration={0}>
            <div
              className="mt-[12px] cursor-pointer overflow-hidden text-[14px] break-words text-ellipsis sm:text-[16px]"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                maxHeight: '78px',
              }}>
              {description}
            </div>
          </Tippy>
        </div>

        {/* 버튼 영역 */}
        <div className="flex h-[48px] w-full max-[744px]:mt-[40px] max-[744px]:h-[48px] max-[375px]:mt-[24px] max-[375px]:h-[38px]">
          <Button
            variant={buttonConfig.variant}
            disabled={buttonConfig.disabled}
            onClick={buttonConfig.onClick}
            className="h-full max-w-none flex-1">
            {buttonConfig.text}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostBannerUser;
