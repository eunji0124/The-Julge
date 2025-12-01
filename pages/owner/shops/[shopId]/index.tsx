import { useEffect, useState } from 'react';

import shops from '@/api/owner/shop';
import { ShopRequest, NoticeRequest } from '@/api/types';
import users from '@/api/users';
import Button from '@/components/common/Button';
import ShopBanner from '@/components/owner/ShopBanner';
import Post from '@/components/post/Post';
import noticesApi from '@/api/owner/notice';

const MyShop = () => {
  const [shop, setShop] = useState<({ id: string } & ShopRequest) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  type ShopNoticeItem = { id: string } & NoticeRequest & { closed: boolean };
  const [notices, setNotices] = useState<ShopNoticeItem[]>([]);
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

  const category: Category =
    shop && allowedCategories.includes(shop.category as Category)
      ? (shop.category as Category)
      : '기타';

  useEffect(() => {
    const fetchShopAndNotices = async () => {
      try {
        const userId = localStorage.getItem('userId');
        // const userId = 'cfe001f7-5085-4fa9-bb0a-506ed86ebfd7'; 테스트 코드
        if (!userId) {
          setError('로그인이 필요합니다.');
          return;
        }
        // 가게 유무
        const userRes = await users.getUser(userId);
        const user = userRes?.item;
        const shopItem = user?.shop?.item;
        if (!shopItem) {
          setError('유저의 가게 정보가 없습니다.');
          return;
        }
        // 가게 정보 유무
        const shopId = shopItem.id;
        const shopRes = await shops.getShop(shopId);
        const shopData = shopRes?.item;
        if (!shopData) {
          setError('가게 정보를 가져올 수 없습니다.');
          return;
        }
        setShop(shopData);

        const noticeRes = await noticesApi.getShopNoticeList(shopId);

        const noticeItems = noticeRes.items.map((n) => n.item);

        setNotices(noticeItems);
      } finally {
        setLoading(false);
      }
    };

    fetchShopAndNotices();
  }, []);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-6 pt-15">
        <div className="mx-auto w-[964px] max-[744px]:w-[680px] max-[375px]:w-[351px]">
          <h1 className="mb-6 text-[28px] font-bold max-[375px]:mb-[16px] max-[375px]:text-[20px]">
            내 가게
          </h1>
          {!loading && !error && !shop && (
            <div className="border-gray-20 flex flex-col items-center justify-center gap-6 rounded-xl border px-6 py-[60px]">
              <p className="text-[16px] max-[375px]:text-[14px]">
                내 가게를 소개하고 공고도 등록해보세요.
              </p>
              <Button className="h-[47px] w-[346px] max-w-none! max-[375px]:h-[37px] max-[375px]:w-[108px]">
                가게 등록하기
              </Button>
            </div>
          )}

          {!loading && !error && shop && (
            <ShopBanner
              category={category}
              name={shop.name}
              location={shop.address1}
              imageUrl={shop.imageUrl}
              description={shop.description}
            />
          )}
        </div>
      </div>
      {!loading && !error && shop && (
        <div className="mx-auto max-w-[1440px] px-6 pt-15">
          <div className="mx-auto w-[964px] max-[744px]:w-[680px] max-[375px]:w-[351px]">
            <h2 className="mb-6 text-[28px] font-[700] max-[744px]:mb-[24px] max-[375px]:mb-[16px] max-[375px]:text-[20px]">
              내가 등록한 공고
            </h2>

            {!loading && !error && notices && (
              <div className="grid grid-cols-3 gap-6 max-[744px]:grid-cols-2 max-[375px]:grid-cols-1">
                {notices.length > 0 ? (
                  notices.map((notice) => (
                    <Post
                      key={notice.id}
                      name={shop.name}
                      noticeId={notice.id}
                      startAt={notice.startsAt}
                      workTime={notice.workhour}
                      location={shop.address1}
                      wage={notice.hourlyPay}
                      imageUrl={shop.imageUrl}
                    />
                  ))
                ) : (
                  <div className="border-gray-20 flex flex-col items-center justify-center gap-6 rounded-xl border px-6 py-[60px]">
                    <div className="text-[16px] max-[375px]:text-[14px]">
                      공고를 등록해 보세요.
                    </div>

                    <div className="h-[47px] w-[346px] max-[375px]:h-[37px] max-[375px]:w-[108px]">
                      <Button className="h-full w-full max-w-none!">
                        공고 등록하기
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MyShop;
