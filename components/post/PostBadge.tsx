import { postClasses } from '@/lib/utils/postClasses';
import { BadgeProps } from '@/types/post';

import BadgeArrow from '../icons/BadgeArrow';
interface PostBadgeProps extends BadgeProps {
  showMobile?: boolean; // 모바일 뱃지 렌더 여부
}
const PostBadge = ({
  percentage,
  isColor,
  getBadgeColor,
  showMobile = true,
}: PostBadgeProps) => (
  <>
    {/* 데스크탑, 태블릿 버전 뱃지 */}
    <span
      className={`${postClasses.badge({ isActive: isColor })} ${getBadgeColor(percentage, true)}`}>
      기존 시급보다 {percentage}%
      <BadgeArrow className={postClasses.badgeArrow()} />
    </span>
    {/* 모바일 버전 뱃지 */}
    {showMobile && (
      <span
        className={`${postClasses.badgeText({ isActive: isColor })} ${getBadgeColor(percentage, false)}`}>
        기존 시급보다 {percentage}%
        <BadgeArrow className={postClasses.badgeArrow()} />
      </span>
    )}
  </>
);

export default PostBadge;
