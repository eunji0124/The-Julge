import { useState, useRef } from 'react';

import Image from 'next/image';

import { toast } from 'react-toastify';

import { uploadImage } from '@/api/uploadImage';

/**
 * ImageUpload 사용 예제
 *
 * import ImageUpload from '@/components/common/ImageUpload';
 *
 * const Ex = () => {
 *  return (
 *   <>
 *    <ImageUpload />
 *   </>
 *  );
 *};
 */

interface ImageUploadProps {
  initialImageUrl?: string;
  onUploadSuccess?: (url: string) => void;
}

const ImageUpload = ({
  initialImageUrl = '',
  onUploadSuccess,
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl);
  const [isUploading, setIsUploading] = useState(false);

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 이미지 파일인지 검증
      if (!file.type.startsWith('image/')) {
        toast.error('이미지 파일만 업로드 가능합니다.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      const url = await uploadImage(selectedFile);
      setImageUrl(url);
      onUploadSuccess?.(url);
      toast.success('이미지 업로드 성공!');

      // 초기화
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      toast.error('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex max-h-max min-h-[calc(100vh-231px)] items-center justify-center sm:min-h-[calc(100vh-170px)]">
      <div>
        <h2 className="mb-4 text-xl font-bold">이미지 업로드</h2>
        <div className="mb-4 flex items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleSelectFile}
            ref={fileInputRef}
            disabled={isUploading}
            className="file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          />
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="rounded border border-white px-4 py-2 transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50">
            {isUploading ? '업로드 중...' : '확인'}
          </button>
        </div>
        {imageUrl && (
          <div className="mt-4">
            <p className="mb-2 text-sm">경로: {imageUrl}</p>
            <div className="relative h-64 w-full max-w-sm">
              <Image
                src={imageUrl}
                alt="업로드된 이미지"
                fill
                className="rounded object-contain shadow-lg"
                sizes="(max-width: 768px) 100vw, 384px"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
