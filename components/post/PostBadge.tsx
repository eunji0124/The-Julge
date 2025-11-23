import { postClasses } from '@/lib/utils/postClasses';
import { BadgeProps } from '@/types/post';

import BadgeArrow from '../icons/BadgeArrow';

const PostBadge = ({ percentage, isColor, getBadgeColor }: BadgeProps) => (
  <>
    {/* 데스크탑, 태블릿 버전 뱃지 */}
    <span
      className={`${postClasses.badge({ isActive: isColor })} ${getBadgeColor(percentage, true)}`}>
      기존 시급보다 {percentage}%
      <BadgeArrow className={postClasses.badgeArrow()} />
    </span>
    {/* 모바일 버전 뱃지 */}
    <span
      className={`${postClasses.badgeText({ isActive: isColor })} ${getBadgeColor(percentage, false)}`}>
      기존 시급보다 {percentage}%
      <BadgeArrow className={postClasses.badgeArrow()} />
    </span>
  </>
);

export default PostBadge;
