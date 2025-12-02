import { useState, useEffect } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Button from '@/components/common/Button';
import Dropdown from '@/components/common/Dropdown';
import ConfirmModal from '@/components/common/modal/ConfirmModal';
import ErrorModal from '@/components/common/modal/ErrorModal';
import Table from '@/components/common/Table';
import EmptyProfileState from '@/components/profile/EmptyProfileState';
import UserProfileCard from '@/components/profile/UserProfileCard';
import { SEOUL_DISTRICTS } from '@/constants/locations';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';
import { useUserApplications } from '@/hooks/useUserApplications';
import { useUserProfile } from '@/hooks/useUserProfile';
import { transformEmployeeData } from '@/lib/utils/transformTableData';
import { useAuthStore } from '@/store/useAuthStore';

// 입력 영역 컨테이너 스타일 정의
const INPUT_BOX_STYLE =
  'flex w-full flex-col gap-2 text-base leading-relaxed font-normal';

// input 및 textarea 공통 스타일 정의
const INPUT_STYLE =
  'border-gray-30 placeholder:text-gray-40 w-full rounded-md border px-5 py-4 focus:ring-2 focus:ring-red-50 focus:outline-none disabled:bg-gray-10 disabled:cursor-not-allowed';

// title 스타일 정의
const TITLE_STYLE =
  'text-xl font-bold leading-normal sm:text-[28px] sm:tracking-[0.56px]';

// EmptyProfileState 컴포넌트에 전달할 데이터 타입 정의
type EmptyStateData = {
  message: string;
  buttonText?: string | undefined;
  link?: string | undefined;
};

/**
 * 상태별 EmptyProfileState 컴포넌트에 표시할 데이터 정의
 *
 * LOADING: 프로필 데이터 로딩 중 상태
 * ERROR: 에러 발생 상태 (네트워크 오류 등)
 * PROFILE: 프로필 미등록 상태 (404 또는 빈 프로필)
 * APPLICATIONS: 신청 내역이 없는 상태
 */
const EMPTY_STATE_DATA: Record<string, EmptyStateData> = {
  LOADING: {
    message: '로딩 중...',
    buttonText: undefined,
    link: undefined,
  },
  ERROR: {
    message: '데이터를 불러오는 데 실패했습니다.',
    buttonText: undefined,
    link: undefined,
  },
  PROFILE: {
    message: '내 프로필을 등록하고 원하는 가게에 지원해 보세요.',
    buttonText: '내 프로필 등록하기',
    link: '/staff/profile/register',
  },
  APPLICATIONS: {
    message: '아직 신청 내역이 없어요.',
    buttonText: '공고 보러가기',
    link: '/notices',
  },
};

/**
 * 내 프로필 페이지 컴포넌트 (상세 + 등록/편집 통합)
 */
const Profile = () => {
  const router = useRouter();

  // 인증 체크: 로그인하지 않은 경우 /login으로 리다이렉트
  const { isAuthenticated } = useAuthRedirect('/login');

  // Zustand에서 user 정보 가져오기
  const { user } = useAuthStore();

  // 프로필 데이터 조회
  const { profile, isLoading: isProfileLoading, error } = useUserProfile();

  // 편집 모드 상태 (프로필이 없으면 등록 모드로 시작)
  const [isEditMode, setIsEditMode] = useState(false);

  // // 프로필이 없을 때 자동으로 편집 모드로 전환
  // useEffect(() => {
  //   if (!isProfileLoading && !profile) {
  //     setIsEditMode(true);
  //   }
  // }, [profile, isProfileLoading]);

  // 프로필 폼 로직 - profile이 로드된 후에만 초기화
  const { formData, isLoading, hasFormChanged, handleChange, handleSubmit } =
    useUpdateProfile(isProfileLoading ? null : profile);

  // 지원 목록 조회 - 프로필이 있을 때만 활성화
  const {
    applications,
    isLoading: applicationsLoading,
    error: applicationsError,
  } = useUserApplications({
    userId: user?.id,
    enabled: !!profile && !isEditMode, // 프로필이 있고 편집 모드가 아닐 때만 조회
  });

  // 에러 Modal
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
  // 페이지 이탈 확인 Modal
  const [confirmModal, setConfirmModal] = useState(false);
  // Modal 메시지
  const [successMessage, setSuccessMessage] = useState('');

  // Dropdown 열림/닫힘 상태 관리
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /**
   * 에러 Modal 열기
   */
  const openErrorModal = (message: string) => {
    setErrorModal({ isOpen: true, message });
  };

  /**
   * 성공 모달 열기
   */
  const openSuccessModal = (message: string) => {
    setSuccessMessage(message);
    setErrorModal({ isOpen: true, message });
  };

  /**
   * 일반 에러 모달 닫기
   */
  const closeModal = () => {
    setErrorModal({ isOpen: false, message: '' });
  };

  /**
   * 성공 모달 닫기 및 편집 모드 종료
   */
  const closeSuccessModal = () => {
    setErrorModal({ isOpen: false, message: '' });
    setSuccessMessage('');
    setIsEditMode(false);
    // 프로필 데이터 새로고침을 위해 페이지 리로드
    router.replace(router.asPath);
  };

  /**
   * 페이지 닫기 핸들러
   */
  const handleClose = () => {
    if (hasFormChanged) {
      setConfirmModal(true);
    } else {
      setIsEditMode(false);
    }
  };

  /**
   * 페이지 이탈 확인
   */
  const confirmLeave = () => {
    setConfirmModal(false);
    setIsEditMode(false);
  };

  /**
   * 주소 드롭다운 토글 핸들러
   */
  const handleDropdownToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isLoading && !isProfileLoading) {
      setIsDropdownOpen((prev) => !prev);
    }
  };

  /**
   * 주소 선택 핸들러
   */
  const handleAddressSelect = (value: string) => {
    if (!isLoading && !isProfileLoading) {
      handleChange({
        target: { name: 'address', value },
      } as React.ChangeEvent<HTMLInputElement>);
      setIsDropdownOpen(false);
    }
  };

  /**
   * form 제출 핸들러
   */
  const onSubmit = () => {
    handleSubmit(openSuccessModal, openErrorModal);
  };

  /**
   * 프로필 에러 처리 effect
   */
  useEffect(() => {
    if (error && profile === null && !isProfileLoading) {
      // 프로필이 없는 경우는 에러가 아니므로 무시
      const is404 = error.includes('404') || error.includes('찾을 수 없');
      if (!is404) {
        openErrorModal(error);
      }
    }
  }, [error, profile, isProfileLoading]);

  /**
   * 지원 목록 상태에 따른 콘텐츠를 반환하는 함수
   *
   * @returns 지원 목록 데이터, 로딩 상태, 에러 상태에 따른 React 노드
   */
  const getApplicationsContent = (): React.ReactNode => {
    // 데이터가 있고 items가 있을 때 - Table 컴포넌트로 표시
    if (applications && applications.items && applications.items.length > 0) {
      const tableData = transformEmployeeData(applications.items);
      return <Table data={tableData} rowKey="id" />;
    }

    // 기본 상태 설정: 데이터가 없을 때 사용될 APPLICATIONS 데이터 (버튼 포함)
    let data = EMPTY_STATE_DATA.APPLICATIONS;
    let currentMessage = data.message;

    // 로딩 중일 때 - 버튼 없이 로딩 메시지만 표시
    if (applicationsLoading) {
      data = EMPTY_STATE_DATA.LOADING;
      currentMessage = data.message;
    }

    // 에러 발생 시 - 버튼 없이 에러 메시지만 표시
    if (applicationsError) {
      data = EMPTY_STATE_DATA.ERROR;
      currentMessage = data.message;
    }

    // EmptyProfileState 렌더링
    return (
      <EmptyProfileState
        message={currentMessage}
        buttonText={data.buttonText}
        link={data.link}
      />
    );
  };

  // 인증되지 않았을 때
  if (!isAuthenticated) {
    return null;
  }

  // 현재 모달이 성공 모달인지 확인
  const isSuccessModal =
    errorModal.message === successMessage && successMessage !== '';

  // form이 비활성화되어야 하는 상태
  const isFormDisabled = isLoading || isProfileLoading;

  // 편집 모드일 때 - 프로필 등록/편집 폼 표시
  if (isEditMode) {
    return (
      <>
        <Head>
          <title>내 프로필 {profile ? '편집' : '등록'} | The-Julge</title>
          <meta name="description" content="내 프로필 등록 페이지" />
        </Head>
        <div className="bg-gray-05 max-h-max min-h-[calc(100vh-231px)] px-3 pt-10 pb-20 sm:min-h-[calc(100vh-170px)] sm:px-8 sm:py-15">
          <div className="mx-auto lg:max-w-[964px]">
            {/* 제목 및 닫기 버튼 */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold sm:text-[28px] sm:tracking-[0.56px]">
                내 프로필
              </h2>
              <button
                onClick={handleClose}
                disabled={isFormDisabled}
                className="flex h-6 w-6 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 sm:h-8 sm:w-8">
                <Image
                  src="/images/close.svg"
                  width={14}
                  height={14}
                  alt="내 프로필 등록 페이지 닫기"
                  className="sm:h-[18px] sm:w-[18px]"
                />
              </button>
            </div>

            {/* Form */}
            <div className="my-6 grid w-full grid-cols-1 grid-rows-1 items-center justify-center gap-5 sm:my-8 sm:grid-cols-2 sm:grid-rows-[min-content_min-content_min-content] sm:gap-6 sm:gap-x-5 lg:grid-cols-3 lg:grid-rows-[min-content_min-content]">
              {/* 이름 */}
              <div className={INPUT_BOX_STYLE}>
                <label htmlFor="name">이름*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="입력"
                  disabled={isFormDisabled}
                  className={INPUT_STYLE}
                />
              </div>

              {/* 연락처 */}
              <div className={INPUT_BOX_STYLE}>
                <label htmlFor="phone">연락처*</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="입력"
                  disabled={isFormDisabled}
                  className={INPUT_STYLE}
                />
              </div>

              {/* 선호 지역 */}
              <div className={`${INPUT_BOX_STYLE} relative`}>
                <label htmlFor="address">선호 지역</label>
                <button
                  type="button"
                  onClick={handleDropdownToggle}
                  disabled={isFormDisabled}
                  className={`${INPUT_STYLE} flex items-center justify-between`}>
                  <span
                    className={
                      formData.address ? 'text-black' : 'text-gray-40'
                    }>
                    {formData.address || '선택'}
                  </span>
                  {isDropdownOpen ? (
                    <Image
                      src="/images/dropdownOpen.svg"
                      width={16}
                      height={16}
                      alt="선호 지역 드롭다운 열기"
                    />
                  ) : (
                    <Image
                      src="/images/dropdownClose.svg"
                      width={16}
                      height={16}
                      alt="선호 지역 드롭다운 닫기"
                    />
                  )}
                </button>

                {isDropdownOpen && !isFormDisabled && (
                  <Dropdown
                    items={[...SEOUL_DISTRICTS]}
                    selected={formData.address}
                    onSelect={handleAddressSelect}
                    onClose={() => setIsDropdownOpen(false)}
                  />
                )}
              </div>

              {/* 소개 */}
              <div
                className={`${INPUT_BOX_STYLE} sm:col-span-2 sm:col-start-1 lg:col-span-3`}>
                <label htmlFor="bio">소개</label>
                <textarea
                  name="bio"
                  id="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="입력"
                  rows={5}
                  disabled={isFormDisabled}
                  className={`${INPUT_STYLE} resize-none`}
                />
              </div>
            </div>

            {/* 등록하기 버튼 */}
            <div className="align-center flex w-full justify-center">
              <Button
                variant="primary"
                size="large"
                onClick={onSubmit}
                disabled={isFormDisabled || !hasFormChanged}>
                {isFormDisabled ? '처리중...' : '등록하기'}
              </Button>
            </div>
          </div>

          {/* Modal */}
          {errorModal.isOpen && (
            <ErrorModal
              message={errorModal.message}
              onClose={isSuccessModal ? closeSuccessModal : closeModal}
            />
          )}

          {/* 확인 Modal */}
          <ConfirmModal
            isOpen={confirmModal}
            message="변경된 내용이 저장되지 않습니다.<br>페이지를 이동하시겠습니까?"
            onConfirm={confirmLeave}
            onCancel={() => setConfirmModal(false)}
          />
        </div>
      </>
    );
  }

  // 상세 보기 모드 - 프로필 정보 표시
  return (
    <>
      <Head>
        <title>내 프로필 상세 | The-Julge</title>
        <meta name="description" content="내 프로필 상세 페이지" />
      </Head>
      <div className="max-h-max min-h-[calc(100vh-231px)] sm:min-h-[calc(100vh-170px)]">
        {/* 내 프로필 */}
        <div
          className={`mx-auto flex flex-col gap-4 px-3 py-10 sm:gap-6 sm:px-8 sm:py-15 lg:max-w-[964px] ${profile ? 'lg:flex-row lg:justify-between lg:gap-0' : ''}`}>
          <h2 className={TITLE_STYLE}>내 프로필</h2>
          {profile ? (
            <UserProfileCard
              profile={profile}
              onEdit={() => setIsEditMode(true)}
            />
          ) : (
            <EmptyProfileState
              message="내 프로필을 등록하고 원하는 가게에 지원해 보세요."
              buttonText="내 프로필 등록하기"
              onClick={() => setIsEditMode(true)}
            />
          )}
        </div>

        {/* 신청 내역 */}
        {profile && (
          <div className="mx-auto flex flex-col gap-4 px-3 pt-10 pb-20 sm:gap-8 sm:px-8 sm:pt-15 sm:pb-30 lg:max-w-[964px]">
            <h2 className={TITLE_STYLE}>신청 내역</h2>
            {getApplicationsContent()}
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
