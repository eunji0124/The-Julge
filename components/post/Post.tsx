import { usePost } from '@/hooks/post/usePost';
import { postClasses } from '@/lib/utils/postClasses';

import PostImage from './PostImage';
import PostLocation from './PostLocation';
import PostTime from './PostTime';
import PostWage from './PostWage';

interface StoreInfo {
  name: string;
  startAt: string;
  workTime: number;
  location: string;
  wage: number;
  imageUrl: string;
  isActive?: boolean;
  percentage?: number;
  className?: string;
  onClick?: () => void;
}

const Post = ({
  name,
  startAt,
  workTime,
  location,
  wage,
  imageUrl,
  isActive = true,
  percentage,
  className,
  onClick,
}: StoreInfo) => {
  const router = useRouter();
  const { workInfo, isColor, overlayText, getBadgeColor } = usePost({
    startAt,
    workTime,
    isActive,
  });

  return (
     <div
      className={`${postClasses.container()} ${className || ''} cursor-pointer transition-colors duration-200 hover:scale-[1.02] hover:shadow-lg`}
      onClick={onClick} // 추가
      style={{ cursor: onClick ? 'pointer' : 'default' }}>
      {/* 이미지 + 오버레이 */}
      <div className="h-[84px] max-w-[280px] overflow-hidden rounded-lg transition-transform duration-200 hover:brightness-105 sm:h-[160px]">
        <PostImage
          imageUrl={imageUrl}
          name={name}
          isColor={isColor}
          overlayText={overlayText}
        />
      </div>

      {/* 정보 영역 - 근무시간, 가게위치, 시급 */}
      <div className="flex flex-col gap-2 transition-all duration-200 hover:brightness-105">
        <h2 className={postClasses.title({ isActive: isColor })}>{name}</h2>
        <PostTime workInfo={workInfo} isColor={isColor} />
        <PostLocation location={location} isColor={isColor} />
        <PostWage
          wage={wage}
          percentage={percentage}
          isColor={isColor}
          getBadgeColor={getBadgeColor}
        />
      </div>
    </div>
  );
};

export default Post;
