import ClockIcon from '@/components/icons/ClockIcon';
import MapIcon from '@/components/icons/MapIcon';
import { formatWorkTime } from '@/lib/utils/formatWorkTime';
import { postClasses } from '@/lib/utils/postClasses';

interface StoreInfo {
  name: string;
  startAt: string;
  workTime: number;
  location: string;
  wage: number;
  imageUrl: string;
  isActive?: boolean; // 활성/비활성 상태
}
const Post = ({
  name,
  startAt,
  workTime,
  location,
  wage,
  imageUrl,
  isActive = true,
}: StoreInfo) => {
  const displayWorkTime = formatWorkTime(startAt, workTime);

  return (
    <div className={postClasses.container()}>
      <div className="relative h-[84px] max-w-[280px] sm:h-[160px]">
        <img
          src={imageUrl}
          alt={`${name} 사진`}
          className="h-full w-full rounded-[12px] object-cover"
        />
        {/* isActive === false 일 때만 오버레이 표시 */}
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center rounded-[12px] bg-black/70">
            <span className="text-[20px] font-[700] tracking-[0.02em] text-[var(--color-gray-30)] sm:text-[28px]">
              지난 공고
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {/* 가게 이름 */}
        <h3 className={postClasses.title({ isActive })}>{name}</h3>

        {/* 근무 시간 */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-start gap-2">
            <ClockIcon className={postClasses.icon({ isActive })} />
            <time className={postClasses.text({ isActive })}>
              {displayWorkTime}
            </time>
          </div>
        </div>
        {/* 위치 */}
        <div className="flex items-center gap-2">
          <MapIcon className={postClasses.icon({ isActive })} />
          <span className={postClasses.text({ isActive })}>{location}</span>
        </div>

        {/* 시급 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className={postClasses.wage({ isActive })}>
            {wage.toLocaleString()}원
          </h2>
          {/* 뱃지 (sm 이상에만 표시) */}
          <span className={postClasses.badge({ isActive })}>
            기존 시급보다 50%
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.03333 13.2H4.03333V6.53333H0L6.53333 0L13.0667 6.53333H9.03333V13.2Z"
                fill="white"
              />
            </svg>
          </span>

          {/* 모바일/태블릿용 뱃지 텍스트 */}
          <span className={postClasses.badgeText({ isActive })}>
            기존 시급보다 50%
            <svg
              width="13"
              height="13"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M9.03333 13.2H4.03333V6.53333H0L6.53333 0L13.0667 6.53333H9.03333V13.2Z" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Post;
