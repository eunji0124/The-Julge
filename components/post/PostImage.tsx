import { PostImageProps } from '@/types/post';

const PostImage = ({ imageUrl, name, isGray, overlayText }: PostImageProps) => {
  return (
    <div className="relative h-[84px] max-w-[280px] sm:h-[160px]">
      <img
        src={imageUrl}
        alt={`${name} 사진`}
        className="h-full w-full rounded-[12px] object-cover"
      />
      {!isGray && overlayText && (
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
