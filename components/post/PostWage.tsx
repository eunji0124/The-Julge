import { postClasses } from '@/lib/utils/postClasses';
import { PostWageProps } from '@/types/post';

import PostBadge from './PostBadge';
interface NewPostWageProps extends PostWageProps {
  size?: 'sm' | 'md';
  showMobileBadge?: boolean;
}
const PostWage = ({
  wage,
  percentage,
  isColor,
  getBadgeColor,
  size = 'sm',
  showMobileBadge = true,
}: NewPostWageProps) => (
  <div className="flex flex-col gap-2 whitespace-nowrap sm:flex-row sm:items-center sm:justify-between">
    <h3 className={postClasses.wage({ isActive: isColor, size })}>
      {wage.toLocaleString()}원
    </h3>
    {percentage && (
      <PostBadge
        percentage={percentage}
        isColor={isColor}
        getBadgeColor={getBadgeColor}
        showMobile={showMobileBadge}
      />
    )}
  </div>
);

export default PostWage;
