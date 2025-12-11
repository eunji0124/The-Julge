import Head from 'next/head';
import { useRouter } from 'next/router';

import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import AlertModal from '@/components/common/modal/AlertModal';
import ConfirmModal from '@/components/common/modal/ConfirmModal';
import NoticeNotFound from '@/components/common/NoticeNotFound';
import NoticeDetailContent from '@/components/notice/NoticeDetailContent';
import RecentNoticesSection from '@/components/notice/RecentNoticesSection';
import { useNoticeApplication } from '@/hooks/useNoticeApplication';
import { useNoticeDetail } from '@/hooks/useNoticeDetail';
import { useRecentNoticesList } from '@/hooks/useRecentNoticesList';

const NoticeDetailPage = () => {
  const router = useRouter();
  const { shopId, noticeId } = router.query;

  // 공고 상세 정보
  const { noticeDetail, isLoading, applicationState, setApplicationState } =
    useNoticeDetail(shopId, noticeId);

  // 최근 본 공고 목록
  const recentNoticesList = useRecentNoticesList(noticeId);

  // 신청/취소 관련 로직
  const {
    handleApply,
    handleCancel,
    isProfileAlertOpen,
    setIsProfileAlertOpen,
    isCancelModalOpen,
    setIsCancelModalOpen,
  } = useNoticeApplication(
    shopId,
    noticeId,
    applicationState,
    setApplicationState
  );

  // 공고 클릭 핸들러
  const handleNoticeClick = (
    clickedShopId: string,
    clickedNoticeId: string
  ) => {
    router.push(
      `/staff/shops?shopId=${clickedShopId}&noticeId=${clickedNoticeId}`
    );
  };

  // 로딩 상태
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // 공고 없음
  if (!noticeDetail) {
    return <NoticeNotFound />;
  }

  return (
    <>
      <Head>
        <title>공고 상세 | The-Julge</title>
        <meta name="description" content="공고 상세 페이지" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* 공고 상세 내용 */}
        <NoticeDetailContent
          notice={noticeDetail}
          applicationStatus={applicationState.status}
          onApply={handleApply}
          onCancel={() => setIsCancelModalOpen(true)}
        />

        {/* 최근 본 공고 */}
        <RecentNoticesSection
          notices={recentNoticesList}
          onNoticeClick={handleNoticeClick}
        />

        {/* 취소 확인 모달 */}
        <ConfirmModal
          isOpen={isCancelModalOpen}
          message="신청을 취소하시겠어요?"
          onConfirm={handleCancel}
          onCancel={() => setIsCancelModalOpen(false)}
        />

        {/* 프로필 미등록 알림 모달 */}
        <AlertModal
          isOpen={isProfileAlertOpen}
          message="내 프로필을 먼저 등록해 주세요."
          onClose={() => setIsProfileAlertOpen(false)}
        />

        {/* 공고 리스트 버튼 */}
        <div className="fixed right-6 bottom-6 z-50">
          <Button
            variant="primary"
            size="medium"
            className="max-w-none! px-4"
            onClick={() => router.push('/')}>
            공고목록
          </Button>
        </div>
      </div>
    </>
  );
};

export default NoticeDetailPage;
