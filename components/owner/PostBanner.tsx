"use client";
{
  /* <ShopBanner
cartegory={'카페'}
name={'도토리 카페'}
location={'성수동'}
imageUrl={
  'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81'
}
description={
  '도토리 카페입니다 도토리 카페입니다 도토리 카페입니다 도토리 카페입니다 도토리 카페입니다 도토리 카페입니다 도토리 카페입니다 도토리 카페입니다 도토리 카페입니다 도토리 카페입니다도토리 카페입니다 도토리 카페입니다 v 도토리 카페입니다 도토리 카페입니다 도토리 카페입니다 도토리 카페입니다 도토리 카페입니다 도토리 카페입니다 도토리 카페입니다도토리 카페입니다 도토리 카페입니다 v 도토리 카페입니다 도토리 카페입니다 도토리 카페입니다 도토리 카페입니다 도토리 카페입니다 도토리 카페입니다 도토리 카페입니다도토리 카페입니다 도토리 카페입니다 v 도토리 카페입니다 도토리 카페입니다 도토리 카페입니다 도토리 카페입니다 도토리 카페입니다 도토리 카페입니다 도토리 카페입니다도토리 카페입니다 도토리 카페입니다 v 도토리 카페입니다 도토리 카페입니다 도토리 카페입니다 도토리 카페입니다  도토리 카페입니다 도토리 카페입니다'
}
/> */
}


import Tippy from '@tippyjs/react';
import { useRouter } from "next/router";
import { usePost } from '@/hooks/post/usePost';

import Button from '../common/Button';
import PostImage from '../post/PostImage';
import PostLocation from '../post/PostLocation';
import PostTime from '../post/PostTime';
import PostWage from '../post/PostWage';
import 'tippy.js/dist/tippy.css';

interface PostBannerProps {
  name: string;
  startAt: string;
  workTime: number;
  location: string;
  wage: number;
  imageUrl: string;
  percentage?: number;
  description: string;
}
const router = useRouter();

const PostBanner = ({
  name,
  startAt,
  workTime,
  location,
  wage,
  imageUrl,
  description,
  percentage,
}: PostBannerProps) => {
  const { workInfo, isColor, getBadgeColor } = usePost({
    startAt,
    workTime,
  });

  return (
    <div className="mx-auto flex w-[964px] gap-6 rounded-[12px] border border-[var(--color-gray-20)] bg-[var(--color-white)] p-6 max-[744px]:w-[680px] max-[744px]:flex-col max-[744px]:gap-4 max-[375px]:w-[351px] max-[375px]:gap-3 max-[375px]:p-5">
      {/* 이미지 영역 */}
      <div className="h-[312px] w-full max-w-[539px] max-[744px]:h-[361px] max-[744px]:max-w-full max-[375px]:h-[178px]">
        <PostImage imageUrl={imageUrl} name={name} isColor={true} />
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
          <PostLocation location={location} isColor={true} size="md" />

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

        {/* 버튼 영역: 항상 아래 */}
        <div className="flex h-[48px] w-full max-[744px]:mt-[40px] max-[744px]:h-[48px] max-[375px]:mt-[24px] max-[375px]:h-[38px]">
          <Button
  variant="secondary"
  onClick={() => router.push("/owner/shop-edit")}
>
  공고 편집하기
</Button>
        </div>
      </div>
    </div>
  );
};

export default PostBanner;
