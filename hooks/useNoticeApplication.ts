import { useState } from 'react';

import { useRouter } from 'next/router';

import { isAxiosError } from 'axios';

import { ApplicationService } from '@/lib/applicationService';
import { useAuthStore } from '@/store/useAuthStore';
import { ApplicationState } from '@/types/application';

export const useNoticeApplication = (
  shopId?: string | string[],
  noticeId?: string | string[],
  applicationState?: ApplicationState,
  setApplicationState?: (state: ApplicationState) => void
) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isProfileAlertOpen, setIsProfileAlertOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // 공고 신청
  const handleApply = async () => {
    // 로그인 체크
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      router.push('/auth?mode=login');
      return;
    }

    if (!user?.id) {
      alert('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      // 프로필 등록 체크
      const isProfileRegistered =
        await ApplicationService.checkProfileRegistered(user.id);

      if (!isProfileRegistered) {
        setIsProfileAlertOpen(true);
        return;
      }

      // 신청 진행
      if (!shopId || !noticeId) return;

      const { applicationId } = await ApplicationService.applyToNotice(
        String(shopId),
        String(noticeId)
      );

      setApplicationState?.({
        status: 'pending',
        applicationId,
      });

      alert('신청이 완료되었습니다!');
    } catch (err: unknown) {
      handleApplicationError(err);
    }
  };

  // 신청 취소
  const handleCancel = async () => {
    if (!shopId || !noticeId || !applicationState?.applicationId) {
      alert('신청 정보를 찾을 수 없습니다.');
      setIsCancelModalOpen(false);
      return;
    }

    try {
      await ApplicationService.cancelNoticeApplication(
        String(shopId),
        String(noticeId),
        applicationState.applicationId
      );

      setApplicationState?.({
        status: 'canceled',
        applicationId: null,
      });

      alert('신청이 취소되었어요!');
    } catch (error) {
      console.error('취소 실패:', error);
      alert('취소에 실패했어요. 다시 시도해주세요!');
    } finally {
      setIsCancelModalOpen(false);
    }
  };

  // 에러 처리
  const handleApplicationError = (err: unknown) => {
    console.error('신청 실패:', err);

    if (isAxiosError(err) && err.response) {
      switch (err.response.status) {
        case 401:
          alert('로그인이 필요합니다.');
          router.push('/auth?mode=login');
          break;
        case 400:
          alert('이미 신청한 공고입니다.');
          break;
        default:
          alert('신청에 실패했습니다. 다시 시도해주세요.');
      }
    } else {
      alert('신청에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return {
    handleApply,
    handleCancel,
    isProfileAlertOpen,
    setIsProfileAlertOpen,
    isCancelModalOpen,
    setIsCancelModalOpen,
  };
};
