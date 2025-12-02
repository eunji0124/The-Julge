import Tippy from '@tippyjs/react';

import { postClasses } from '@/lib/utils/postClasses';

import Button from '../common/Button';
import PostImage from '../post/PostImage';
import PostLocation from '../post/PostLocation';
import 'tippy.js/dist/tippy.css';

interface ShopBannerProps {
  category:
    | '한식'
    | '중식'
    | '일식'
    | '양식'
    | '분식'
    | '카페'
    | '편의점'
    | '기타';
  name: string;
  location: string;
  imageUrl: string;
  description: string;
  shopId: string;
  onEditClick?: () => void;
  onRegisterClick?: () => void;
}

const ShopBanner = ({
  category,
  name,
  location,
  imageUrl,
  description,
  onEditClick,
  onRegisterClick,
}: ShopBannerProps) => {
  return (
    <div className="mx-auto flex w-[964px] gap-6 rounded-[12px] bg-[var(--color-red-10)] p-6 max-[744px]:w-[680px] max-[744px]:flex-col max-[744px]:gap-4 max-[375px]:w-[351px] max-[375px]:gap-3 max-[375px]:p-5">
      {/* 이미지 영역 */}
      <div className="h-[312px] w-[539px] max-[744px]:h-[360.858px] max-[744px]:w-full max-[375px]:h-[177.71px] max-[375px]:w-full">
        <PostImage imageUrl={imageUrl} name={name} isColor={true} />
      </div>

      {/* 정보 영역 */}
      <div className="flex w-[346px] flex-1 flex-col justify-between pt-4 max-[744px]:w-full max-[744px]:pt-0 max-[375px]:w-full max-[375px]:pt-0">
        <div>
          {/* 카테고리 */}
          <span className="text-[16px] leading-[20px] font-[700] tracking-[0%] text-[var(--color-red-50)]">
            {category}
          </span>

          <div className="h-[8px]" />

          {/* 가게 이름 */}
          <h2
            className={`${postClasses.title()} !text-[28px] max-[744px]:!text-[24px]`}>
            {name}
          </h2>

          <div className="h-[12px]" />

          {/* 위치 */}
          <PostLocation location={location} isColor={true} size="md" />

          {/* description */}
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
        <div className="mt-[54px] flex h-[48px] w-full gap-2 max-[744px]:mt-[40px] max-[375px]:mt-[24px] max-[375px]:h-[38px]">
          <Button
            variant="secondary"
            size={undefined}
            onClick={onEditClick}
            className="h-full max-w-none flex-1">
            편집하기
          </Button>
          <Button
            size={undefined}
            onClick={onRegisterClick}
            className="h-full max-w-none flex-1">
            공고 등록하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShopBanner;
