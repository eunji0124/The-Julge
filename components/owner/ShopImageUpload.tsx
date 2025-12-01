import { useRef, useState } from "react";
import Image from "next/image";

interface ShopImageUploadProps {
  onChange: (url: string) => void;
}

export default function ShopImageUpload({ onChange }: ShopImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>("");

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 미리보기 표시
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    // === 파일 백엔드 업로드 ===
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      // 백엔드가 응답해주는 이미지 URL
      const uploadedUrl = data.url;

      onChange(uploadedUrl);
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
    }
  };

  return (
    <div
      onClick={handleImageClick}
      className="w-full h-[200px] border rounded-md flex flex-col items-center justify-center gap-2 cursor-pointer bg-gray-100"
    >
      {!preview ? (
        <>
          <Image
            src="/images/camera.png"
            alt="camera"
            width={24}
            height={24}
          />
          <span className="text-gray-500 text-sm">이미지 추가하기</span>
        </>
      ) : (
        <Image
          src={preview}
          alt="preview"
          width={400}
          height={300}
          className="object-cover rounded-md"
        />
      )}

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
}
