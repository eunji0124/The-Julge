import { useEffect, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import noticesApi from '@/apis/owner/notice';
import shops from '@/apis/owner/shop';
import { ShopRequest, NoticeRequest } from '@/apis/types';
import users from '@/apis/users';
import Button from '@/components/common/Button';
import ShopBanner from '@/components/owner/ShopBanner';
import Post from '@/components/post/Post';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useAuthStore } from '@/store/useAuthStore';
import { calculatePercentage } from '@/utils/transformNotice';

type ShopNoticeItem = { id: string } & NoticeRequest & { closed: boolean };

const allowedCategories = [
  '한식',
  '중식',
  '일식',
  '양식',
  '분식',
  '카페',
  '편의점',
  '기타',
] as const;

type Category = (typeof allowedCategories)[number];

const MyShop = () => {
  const router = useRouter();
  const [shop, setShop] = useState<({ id: string } & ShopRequest) | null>(null);
  const [notices, setNotices] = useState<ShopNoticeItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 인증 체크
  const { isAuthenticated } = useAuthRedirect('/auth?mode=login');
  const { user } = useAuthStore();
  const userId = user?.id || '';

  const category: Category =
    shop && allowedCategories.includes(shop.category as Category)
      ? (shop.category as Category)
      : '기타';

  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    const fetchShopAndNotices = async () => {
      try {
        setLoading(true);

        // 유저 정보에서 가게 ID 확인
        const userRes = await users.getUser(userId);
        const shopItem = userRes?.item?.shop?.item;

        // 가게가 없으면 로딩만 종료 (가게 등록 안내 UI 표시)
        if (!shopItem) {
          setLoading(false);
          return;
        }

        // 가게 상세 정보 가져오기
        const shopId = shopItem.id;
        const shopRes = await shops.getShop(shopId);
        const shopData = shopRes?.item;

        if (shopData) {
          setShop(shopData);

          // 공고 목록 가져오기
          const noticeRes = await noticesApi.getShopNoticeList(shopId);
          const noticeItems = noticeRes.items.map((n) => n.item);
          setNotices(noticeItems);
        }
      } catch (error) {
        console.error('가게 정보 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopAndNotices();
  }, [isAuthenticated, userId]);

  const handlePostClick = (shopId: string, noticeId: string) => {
    router.push(`/owner/notices?shopId=${shopId}&noticeId=${noticeId}`);
  };

  const handleRegisterNotice = () => {
    if (!shop) return;
    router.push(`/owner/notices?shopId=${shop.id}`);
  };

  // 인증되지 않았을 때
  if (!isAuthenticated) {
    return null;
  }

  // 로딩 중
  if (loading) {
    return <div>로딩중...</div>;
  }

  return (
    <>
      <Head>
        <title>내 가게 | The-Julge</title>
        <meta name="description" content="가게 정보 상세 페이지" />
      </Head>

      <div className="mx-auto min-h-screen w-full max-w-[1440px] px-4 pt-15 pb-20 sm:px-6 md:pb-24 lg:pb-32">
        <div className="mx-auto w-full max-w-[964px]">
          <h1 className="mb-4 text-xl font-bold sm:mb-6 sm:text-2xl md:text-[28px]">
            내 가게
          </h1>

          {/* 가게가 없을 때: 가게 등록 안내 */}
          {!shop && (
            <div className="border-gray-20 flex flex-col items-center justify-center gap-4 rounded-xl border px-4 py-12 sm:gap-6 sm:px-6 sm:py-[60px]">
              <p className="text-center text-sm sm:text-base">
                내 가게를 소개하고 공고도 등록해보세요.
              </p>
              <Button
                onClick={() => router.push('/owner/shops/manage')}
                className="h-[37px] w-full max-w-[346px] sm:h-[47px]">
                가게 등록하기
              </Button>
            </div>
          )}

          {/* 가게가 있을 때: 가게 정보 표시 */}
          {shop && (
            <>
              <ShopBanner
                category={category}
                name={shop.name}
                location={shop.address1}
                imageUrl={shop.imageUrl}
                description={shop.description}
                shopId={shop.id}
                onEditClick={() =>
                  router.push(`/owner/shops/manage?shopId=${shop.id}`)
                }
                onRegisterClick={handleRegisterNotice}
              />

              <div className="mt-15">
                <h2 className="mb-6 text-xl font-bold sm:text-2xl md:text-[28px]">
                  내가 등록한 공고
                </h2>

                {notices.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                    {notices.map((notice) => (
                      <Post
                        key={notice.id}
                        name={shop.name}
                        startAt={notice.startsAt}
                        workTime={notice.workhour}
                        location={shop.address1}
                        wage={notice.hourlyPay}
                        onClick={() => handlePostClick(shop.id, notice.id)}
                        imageUrl={shop.imageUrl}
                        isActive={!notice.closed}
                        percentage={calculatePercentage(
                          notice.hourlyPay,
                          shop.originalHourlyPay
                        )}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="border-gray-20 flex flex-col items-center justify-center gap-4 rounded-xl border px-4 py-12 sm:gap-6 sm:px-6 sm:py-[60px]">
                    <p className="text-center text-sm sm:text-base">
                      공고를 등록해 보세요.
                    </p>
                    <Button
                      onClick={handleRegisterNotice}
                      className="h-[37px] w-full max-w-[346px] sm:h-[47px]">
                      공고 등록하기
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MyShop;
