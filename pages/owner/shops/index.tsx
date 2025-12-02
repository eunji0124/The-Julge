import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import Button from '@/components/common/Button';

const MyShop = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 로그인 체크
  useEffect(() => {
    const checkAuth = () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.push('/login');
      } else {
        // 로그인되어 있으면 로딩 종료
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1440px] px-4 pt-15 pb-20 sm:px-6 md:pb-24 lg:pb-32">
      <div className="mx-auto w-full max-w-[964px]">
        <h1 className="mb-4 text-xl font-bold sm:mb-6 sm:text-2xl md:text-[28px]">
          내 가게
        </h1>
        <div className="border-gray-20 flex flex-col items-center justify-center gap-4 rounded-xl border px-4 py-12 sm:gap-6 sm:px-6 sm:py-[60px]">
          <p className="text-center text-sm sm:text-base">
            내 가게를 소개하고 공고도 등록해보세요.
          </p>
          <Button
            onClick={() => router.push('/owner/shop-register')}
            className="h-[37px] w-full max-w-[346px] sm:h-[47px]">
            가게 등록하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyShop;
