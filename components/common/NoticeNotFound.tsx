import { useRouter } from 'next/router';

const NoticeNotFound = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-medium text-gray-900">
          공고를 찾을 수 없습니다.
        </p>
        <button
          onClick={() => router.back()}
          className="mt-4 rounded-lg bg-[#FF5C3F] px-6 py-2 text-white hover:bg-[#FF4A2D]">
          돌아가기
        </button>
      </div>
    </div>
  );
};

export default NoticeNotFound;
