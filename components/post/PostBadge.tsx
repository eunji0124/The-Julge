import { postClasses } from '@/lib/utils/postClasses';
import { BadgeProps } from '@/types/post';

import BadgeArrow from '../icons/BadgeArrow';

const PostBadge = ({ percentage, isGray, getBadgeColor }: BadgeProps) => (
  <>
    <span
      className={`${postClasses.badge({ isActive: isGray })} ${getBadgeColor(percentage, true)}`}>
      기존 시급보다 {percentage}%
      <BadgeArrow className={postClasses.badgeArrow()} />
    </span>
    <span
      className={`${postClasses.badgeText({ isActive: isGray })} ${getBadgeColor(percentage, false)}`}>
      기존 시급보다 {percentage}%
      <BadgeArrow className={postClasses.badgeArrow()} />
    </span>
  </>
);

export default PostBadge;
