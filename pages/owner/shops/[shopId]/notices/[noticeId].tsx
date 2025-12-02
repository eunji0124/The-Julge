// pages/owner/notice/[noticeId].tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import applications from '@/api/owner/application';
import notices from '@/api/owner/notice';
import { ApplicationItem, NoticeRequest, ShopRequest } from '@/api/types';
import Table from '@/components/common/Table';
import PostBanner from '@/components/owner/PostBanner';
import { transformApplicationData } from '@/lib/utils/transformTableData';
import { calculatePercentage } from '@/utils/transformNotice';
import AlertModal from '@/components/common/modal/AlertModal';

const NoticeDetail = () => {
  const router = useRouter();
  const { noticeId, shopId } = router.query;
  const [notice, setNotice] = useState<
    (NoticeRequest & { id: string; closed: boolean }) | null
  >(null);
  const [shop, setShop] = useState<(ShopRequest & { id: string }) | null>(null);
  const [applicationList, setApplicationList] = useState<ApplicationItem[]>([]);
  const [_loading, setLoading] = useState(true);
  const [_actionLoading, setActionLoading] = useState<string | null>(null);

  // 에러 모달 상태
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    if (!noticeId || !shopId) return;

    const fetchNotice = async () => {
      try {
        setLoading(true);

        // 1. 공고 상세 조회
        const noticeRes = await notices.getShopNotice(
          shopId as string,
          noticeId as string
        );

        const noticeData = noticeRes.item;
        setNotice({
          id: noticeData.id,
          hourlyPay: noticeData.hourlyPay,
          startsAt: noticeData.startsAt,
          workhour: noticeData.workhour,
          description: noticeData.description,
          closed: noticeData.closed,
        });

        const shopItem = noticeData.shop?.item;
        if (shopItem) {
          setShop(shopItem);

          // 2. 지원자 목록 조회
          const applicationsRes = await applications.getApplications(
            shopItem.id,
            noticeId as string,
            {
              offset: 0,
              limit: 20,
            }
          );

          const applicationItems = applicationsRes.items.map(
            (item) => item.item
          );

          setApplicationList(applicationItems);
        }
      } catch (e) {
        // Axios 에러 처리
        if (axios.isAxiosError(e) && e.response?.data?.message) {
          setErrorMessage(e.response.data.message);
        } else {
          setErrorMessage('등록 중 오류가 발생했습니다.');
        }
        setErrorModalOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [noticeId, shopId]);

  // 승인 처리
  const handleApprove = async (applicationId: string) => {
    if (!shop?.id || !noticeId) return;

    setActionLoading(applicationId);

    try {
      await applications.updateApplicationStatus(
        shop.id,
        noticeId as string,
        applicationId,
        { status: 'accepted' }
      );

      // 상태 업데이트
      setApplicationList((prevApps) =>
        prevApps.map((app) =>
          app.id === applicationId
            ? { ...app, status: 'accepted' as const }
            : app
        )
      );
      setErrorMessage('지원을 승인했습니다.');
      setErrorModalOpen(true);
    } catch (e) {
      setErrorMessage('승인에 실패했습니다.');
      setErrorModalOpen(true);
    } finally {
      setActionLoading(null);
    }
  };

  // 거절 처리
  const handleReject = async (applicationId: string) => {
    if (!shop?.id || !noticeId) return;

    setActionLoading(applicationId);

    try {
      await applications.updateApplicationStatus(
        shop.id,
        noticeId as string,
        applicationId,
        { status: 'rejected' }
      );

      // 상태 업데이트
      setApplicationList((prevApps) =>
        prevApps.map((app) =>
          app.id === applicationId
            ? { ...app, status: 'rejected' as const }
            : app
        )
      );
      setErrorMessage('지원을 거절했습니다.');
      setErrorModalOpen(true);
    } catch (e) {
      setErrorMessage('거절에 실패했습니다.');
      setErrorModalOpen(true);
    } finally {
      setActionLoading(null);
    }
  };

  if (!notice) return <div className="p-6">공고를 찾을 수 없습니다.</div>;

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-6 pt-6">
        <div className="mx-auto w-[964px] max-[744px]:w-[680px] max-[375px]:w-[351px]">
          {shop && (
            <>
              <div className="mb-2 text-[16px] leading-5 font-bold text-red-50 max-[375px]:text-[14px]">
                {category}
              </div>
              <div className="mb-4 text-[24px] font-bold max-[375px]:text-[20px]">
                {shop.name}
              </div>
              <div className="mb-8">
                <PostBanner
                  name={shop.name}
                  location={shop.address1}
                  imageUrl={shop.imageUrl}
                  description={shop.description}
                  startAt={notice.startsAt}
                  workTime={notice.workhour}
                  wage={notice.hourlyPay}
                  percentage={calculatePercentage(
                    notice.hourlyPay,
                    shop.originalHourlyPay
                  )}
                />
              </div>

              {/* 공고 설명 */}
              <div className="bg-gray-10 mb-8 flex flex-col gap-8 rounded-xl p-8 max-[744px]:p-8 max-[375px]:p-5">
                <div className="text-[16px] leading-5 font-bold text-black max-[375px]:text-[14px]">
                  공고 설명
                </div>
                <div className="text-[16px] leading-[26px] font-normal text-black max-[375px]:text-[14px] max-[375px]:leading-[22px]">
                  {notice.description}
                </div>
              </div>

              {/* 신청자 목록 */}
              <div className="mb-4">
                <div className="mb-2 text-[18px] font-semibold max-[375px]:text-[16px]">
                  신청자 목록
                </div>
                <div className="mb-15">
                  <Table
                    data={transformApplicationData(applicationList).map(
                      (item) => ({
                        ...item,
                        status: item.status === 'pending' ? '' : item.status,
                      })
                    )}
                    rowKey="id"
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* 에러 모달 */}
      <AlertModal
        isOpen={errorModalOpen}
        message={errorMessage}
        onClose={() => setErrorModalOpen(false)}
      />
    </>
  );
};

export default NoticeDetail;
