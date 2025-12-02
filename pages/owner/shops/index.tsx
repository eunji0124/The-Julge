import Head from 'next/head';
import { useRouter } from 'next/router';

import Button from '@/components/common/Button';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useIsEmployer } from '@/hooks/useCheckUserType';
import { useAuthStore } from '@/store/useAuthStore';

const MyShop = () => {
  const router = useRouter();

  // 인증 체크: 로그인하지 않은 경우 /login으로 리다이렉트
  const { isAuthenticated } = useAuthRedirect('/login');

  // Zustand에서 user 정보 가져오기
  const { user } = useAuthStore();

  const isEmployer = useIsEmployer();
  const shopId = user?.shop?.item.id;

  // 인증되지 않았을 때 (리다이렉트 중)
  if (!isAuthenticated) {
    return null;
  }

  if (isEmployer && shopId) {
    router.push('/owner/shops/' + shopId);
  }

  return (
    <>
      <Head>
        <title>가게 정보 상세 | The-Julge</title>
        <meta name="description" content="가게 정보 상세 페이지" />
      </Head>
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
    </>
  );
};

export default MyShop;
