import ClockIcon from '@/components/icons/ClockIcon';
import { postClasses } from '@/lib/utils/postClasses';
import { PostTimeProps } from '@/types/post';

const PostTime = ({ workInfo, isColor }: PostTimeProps) => (
  <div className="flex items-start gap-2">
    <ClockIcon className={postClasses.icon({ isActive: isColor })} />
    <time className={postClasses.text({ isActive: isColor })}>
      {workInfo.text}
    </time>
  </div>
);

export default PostTime;
