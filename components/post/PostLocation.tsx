import MapIcon from '@/components/icons/MapIcon';
import { postClasses } from '@/lib/utils/postClasses';
import { PostLocationProps } from '@/types/post';

const PostLocation = ({ location, isColor }: PostLocationProps) => (
  <div className="flex items-center gap-2">
    <MapIcon className={postClasses.icon({ isActive: isColor })} />
    <span className={postClasses.text({ isActive: isColor })}>{location}</span>
  </div>
);

export default PostLocation;
