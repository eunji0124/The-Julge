import { postClasses } from '@/lib/utils/postClasses';
import { PostWageProps } from '@/types/post';

import PostBadge from './PostBadge';

const PostWage = ({
  wage,
  percentage,
  isColor,
  getBadgeColor,
}: PostWageProps) => (
  <div className="flex flex-col gap-2 whitespace-nowrap sm:flex-row sm:items-center sm:justify-between">
    <h3 className={postClasses.wage({ isActive: isColor })}>
      {wage.toLocaleString()}원
    </h3>
    {percentage && (
      <PostBadge
        percentage={percentage}
        isColor={isColor}
        getBadgeColor={getBadgeColor}
      />
    )}
  </div>
);

export default PostWage;
