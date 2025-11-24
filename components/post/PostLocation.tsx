import MapIcon from '@/components/icons/MapIcon';
import { postClasses } from '@/lib/utils/postClasses';
import { PostLocationProps } from '@/types/post';

interface NewPostLocationProps extends PostLocationProps {
  size?: 'sm' | 'md' | 'lg';
}

const PostLocation = ({
  location,
  isColor,
  size = 'sm',
}: NewPostLocationProps) => (
  <div className="flex items-center gap-2">
    <MapIcon className={postClasses.icon({ isActive: isColor })} />
    <span className={postClasses.text({ isActive: isColor, size })}>
      {location}
    </span>
  </div>
);

export default PostLocation;
