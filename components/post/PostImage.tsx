import Image from 'next/image';

import { PostImageProps } from '@/types/post';

const PostImage = ({
  imageUrl,
  name,
  isColor,
  overlayText,
}: PostImageProps) => {
  return (
    <div className="relative h-[84px] max-w-[280px] overflow-hidden rounded-[12px] sm:h-[160px]">
      <Image
        src={imageUrl}
        alt={`${name} 사진`}
        fill
        sizes="(max-width: 640px) 280px, 320px"
        className="object-cover"
      />
      {!isColor && overlayText && (
        <div className="absolute inset-0 flex items-center justify-center rounded-[12px] bg-black/70">
          <span className="text-[20px] font-[700] tracking-[0.02em] text-[var(--color-gray-30)] sm:text-[28px]">
            {overlayText}
          </span>
        </div>
      )}
    </div>
  );
};
export default PostImage;
