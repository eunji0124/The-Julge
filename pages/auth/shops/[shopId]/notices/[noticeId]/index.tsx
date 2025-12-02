import { useEffect, useState, useMemo } from 'react';

import { useRouter } from 'next/router';

import {
  fetchNoticeDetail,
  applyNotice,
  cancelApplication,
} from '@/api/notices';
import users from '@/api/users';
import PostBannerUser from '@/components/auth/PostBanner';
import Button from '@/components/common/Button';
import AlertModal from '@/components/common/modal/AlertModal';
import ConfirmModal from '@/components/common/modal/ConfirmModal';
import Post from '@/components/post/Post';
import { useRecentNotices, addRecentNotice } from '@/hooks/useRecentNotices';
import { useAuthStore } from '@/store/useAuthStore';
import {
  transformNoticeData,
  TransformedNotice,
} from '@/utils/transformNotice';

const NoticeDetailPage = () => {
  const router = useRouter();
  const { shopId, noticeId } = router.query;

  // 인증 상태 확인
  const { isAuthenticated, user } = useAuthStore();

  // 상세 데이터
  const [noticeDetail, setNoticeDetail] = useState<TransformedNotice | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // 최근 본 공고 ID 목록
  const recentNotices = useRecentNotices();

  // 최근 본 공고 (최대 6개)
  const [recentNoticesList, setRecentNoticesList] = useState<
    TransformedNotice[]
  >([]);

  // 신청 상태
  const [applicationStatus, setApplicationStatus] = useState<
    'none' | 'pending' | 'approved' | 'rejected' | 'canceled'
  >('none');

  // applicationId를 별도 상태로 관리
  const [currentApplicationId, setCurrentApplicationId] = useState<
    string | null
  >(null);

  // 취소 모달 팝업
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // 프로필 미등록 알림 모달
  const [isProfileAlertOpen, setIsProfileAlertOpen] = useState(false);

  // 공고 상세 조회
  useEffect(() => {
    if (!shopId || !noticeId) {
      return;
    }
    if (Array.isArray(shopId) || Array.isArray(noticeId)) return;

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const detailResponse = await fetchNoticeDetail(
          String(shopId),
          String(noticeId)
        );
        const transformed = transformNoticeData(detailResponse.item);
        setNoticeDetail(transformed);
        addRecentNotice(String(shopId), String(noticeId));

        // 신청 상태 및 applicationId 저장
        if (detailResponse.item.currentUserApplication) {
          const application = detailResponse.item.currentUserApplication.item;
          const status = application.status;
          setApplicationStatus(status === 'accepted' ? 'approved' : status);
          setCurrentApplicationId(application.id);
        } else {
          setApplicationStatus('none');
          setCurrentApplicationId(null);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('공고 로딩 실패:', err);
        setNoticeDetail(null);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [shopId, noticeId]);

  // 🔧 수정: 현재 공고를 제외한 최근 본 공고 목록을 메모이제이션
  const filteredRecentNotices = useMemo(() => {
    return recentNotices.filter((item) => item.id !== noticeId).slice(0, 6);
  }, [recentNotices, noticeId]);

  // 🔧 수정: Promise.allSettled를 사용하여 개별 공고 조회
  useEffect(() => {
    if (filteredRecentNotices.length === 0) {
      setRecentNoticesList([]);
      return;
    }

    const fetchRecentNotices = async () => {
      try {
        // 각 공고를 개별적으로 조회 (Promise.allSettled 사용)
        const results = await Promise.allSettled(
          filteredRecentNotices.map(({ shopId: recentShopId, id: recentId }) =>
            fetchNoticeDetail(recentShopId, recentId).then((res) =>
              transformNoticeData(res.item)
            )
          )
        );

        // 성공한 결과만 필터링
        const successfulNotices = results
          .filter(
            (result): result is PromiseFulfilledResult<TransformedNotice> =>
              result.status === 'fulfilled'
          )
          .map((result) => result.value);

        // 실패한 요청 로깅
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.warn(
              `공고 로딩 실패 (shopId: ${filteredRecentNotices[index].shopId}, noticeId: ${filteredRecentNotices[index].id}):`,
              result.reason
            );
          }
        });

        setRecentNoticesList(successfulNotices);
      } catch (error) {
        console.error('최근 본 공고 로딩 실패:', error);
        setRecentNoticesList([]);
      }
    };

    fetchRecentNotices();
  }, [filteredRecentNotices]);

  // 신청 버튼
  const handleApply = async () => {
    // 로그인 체크 (API 호출 전)
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    // 프로필 등록 여부 체크
    if (!user?.id) {
      alert('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      // 사용자 프로필 조회
      const userResponse = await users.getProfile(user.id);
      const isProfileRegistered = users.checkProfileRegistered(
        userResponse.item
      );

      // 프로필이 등록되지 않은 경우
      if (!isProfileRegistered) {
        setIsProfileAlertOpen(true);
        return;
      }

      // 프로필이 등록된 경우 신청 진행
      if (!shopId || !noticeId) return;

      // applicationId 확인
      const response = await applyNotice(String(shopId), String(noticeId));
      setApplicationStatus('pending');

      if (response?.item?.id) {
        setCurrentApplicationId(response.item.id);
      }

      alert('신청이 완료되었습니다!');
    } catch (err: any) {
      console.error('신청 실패:', err);

      // API 에러 처리
      if (err?.response?.status === 401) {
        alert('로그인이 필요합니다.');
        router.push('/login');
      } else if (err?.response?.status === 400) {
        alert('이미 신청한 공고입니다.');
      } else {
        alert('신청에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 신청 취소 모달 오픈
  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  // 신청 취소 모달 확인버튼
  const handleCancelConfirm = async () => {
    if (!shopId || !noticeId || !currentApplicationId) {
      console.error('취소에 필요한 정보가 없습니다:', {
        shopId,
        noticeId,
        currentApplicationId,
      });
      alert('신청 정보를 찾을 수 없습니다.');
      setIsCancelModalOpen(false);
      return;
    }

    try {
      await cancelApplication(
        String(shopId),
        String(noticeId),
        currentApplicationId
      );
      setApplicationStatus('canceled');
      setCurrentApplicationId(null);
      alert('신청이 취소되었어요!');
    } catch (error) {
      console.error('취소 실패:', error);
      alert('취소에 실패했어요. 다시 시도해주세요!');
    } finally {
      setIsCancelModalOpen(false);
    }
  };

  // 신청 취소 모달 취소
  const handleCancelCancel = () => {
    setIsCancelModalOpen(false);
  };

  // 최근 본 공고 클릭
  const handleNoticeClick = (
    clickedShopId: string,
    clickedNoticeId: string
  ) => {
    router.push(`/auth/shops/${clickedShopId}/notices/${clickedNoticeId}`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg font-medium text-gray-900">로딩 중...</div>
      </div>
    );
  }

  if (!noticeDetail) {
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
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 카테고리 & 제목 */}
      <div className="bg-white pt-15">
        <div className="mx-auto max-w-[964px] px-3 sm:px-8 lg:px-0">
          <p className="mb-2 text-[14px] leading-[22px] font-bold text-[#FF5C3F]">
            식당
          </p>
          <h1 className="text-[20px] leading-8 font-bold text-black sm:text-[28px] sm:leading-9">
            {noticeDetail.name}
          </h1>
        </div>
      </div>

      {/* PostBannerUser 영역 */}
      <div className="bg-white pt-6">
        <div className="flex justify-center px-3 sm:px-8 lg:px-0">
          <PostBannerUser
            name={noticeDetail.name}
            startAt={noticeDetail.startAt}
            workTime={noticeDetail.workTime}
            location={noticeDetail.location}
            wage={noticeDetail.wage}
            imageUrl={noticeDetail.imageUrl}
            percentage={noticeDetail.percentage}
            description={noticeDetail.description || '공고 설명입니다.'}
            isActive={noticeDetail.isActive}
            applicationStatus={applicationStatus}
            onApply={handleApply}
            onCancel={handleCancelClick}
          />
        </div>
      </div>

      {/* 공고 설명 */}
      <div className="bg-white px-3 pt-6 pb-15 sm:px-8 lg:px-0">
        <div className="bg-gray-10 mx-auto max-w-[964px] rounded-xl px-9 py-9 sm:px-8 lg:px-9 lg:py-9">
          <h2 className="mb-2 text-[20px] leading-[32px] font-bold text-black">
            공고 설명
          </h2>
          <p className="text-[14px] leading-[22px] whitespace-pre-wrap text-black sm:text-[16px] sm:leading-[26px]">
            {noticeDetail.description || '공고 설명입니다.'}
          </p>
        </div>
      </div>

      {/* 최근 본 공고 */}
      {recentNoticesList.length > 0 && (
        <div className="mt-16 pb-20">
          <div className="mx-auto max-w-[964px] px-3 sm:px-8 lg:px-0">
            <h2 className="mb-6 text-[20px] leading-[32px] font-bold text-black sm:text-[28px] sm:leading-[36px]">
              최근에 본 공고
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6">
              {recentNoticesList.map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => handleNoticeClick(notice.shopId, notice.id)}
                  className="cursor-pointer">
                  <Post
                    name={notice.name}
                    startAt={notice.startAt}
                    workTime={notice.workTime}
                    location={notice.location}
                    wage={notice.wage}
                    imageUrl={notice.imageUrl}
                    isActive={notice.isActive}
                    percentage={notice.percentage}
                    className="max-w-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 취소 확인 모달 */}
      <ConfirmModal
        isOpen={isCancelModalOpen}
        message="신청을 취소하시겠어요?"
        onConfirm={handleCancelConfirm}
        onCancel={handleCancelCancel}
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
          className="!max-w-none px-4"
          onClick={() => router.push(`/auth/notices`)}>
          공고목록
        </Button>
      </div>
    </div>
  );
};

export default NoticeDetailPage;
