import { useEffect, useState } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Button from '@/components/common/Button';
import Dropdown from '@/components/common/Dropdown';
import ConfirmModal from '@/components/common/modal/ConfirmModal';
import ErrorModal from '@/components/common/modal/ErrorModal';
import { SEOUL_DISTRICTS } from '@/constants/locations';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';
import { useUserProfile } from '@/hooks/useUserProfile';

// 입력 영역 컨테이너 스타일 정의
const INPUT_BOX_STYLE =
  'flex w-full flex-col gap-2 text-base leading-relaxed font-normal';

// input 및 textarea 공통 스타일 정의
const INPUT_STYLE =
  'border-gray-30 placeholder:text-gray-40 w-full rounded-md border px-5 py-4 focus:ring-2 focus:ring-red-50 focus:outline-none disabled:bg-gray-10 disabled:cursor-not-allowed';

/**
 * 내 프로필 등록 페이지 컴포넌트
 *
 * 주요 기능:
 * - 신규 프로필 등록 및 기존 프로필 수정
 * - 실시간 form 변경 감지
 * - 필수 필드 유효성 검사
 * - 변경사항 저장 여부 확인
 * - 주소 드롭다운 선택
 */
const Register = () => {
  const router = useRouter();

  // 인증 체크: 로그인하지 않은 경우 /login으로 리다이렉트
  const { isAuthenticated } = useAuthRedirect('/login');

  // 프로필 데이터 가져오기
  const {
    profile,
    isLoading: isProfileLoading,
    error: profileError,
    isNotFound,
  } = useUserProfile();

  // 프로필 폼 로직 - profile이 로드된 후에만 초기화
  const { formData, isLoading, hasFormChanged, handleChange, handleSubmit } =
    useUpdateProfile(isProfileLoading ? null : profile);

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
   * @param message - 표시할 에러 메시지
   */
  const openErrorModal = (message: string) => {
    setErrorModal({ isOpen: true, message });
  };

  /**
   * 성공 모달 열기
   * @param message - 표시할 성공 메시지
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
   * 성공 모달 닫기 및 프로필 페이지로 이동
   */
  const closeSuccessModal = () => {
    setErrorModal({ isOpen: false, message: '' });
    setSuccessMessage('');
    router.push('/staff/profile');
  };

  /**
   * 페이지 닫기 핸들러
   * - form이 변경되었으면 확인 모달 표시
   * - 변경사항이 없으면 바로 프로필 페이지로 이동
   */
  const handleClose = () => {
    if (hasFormChanged) {
      // 변경사항이 있으면 확인 모달 표시
      setConfirmModal(true);
    } else {
      // 변경사항이 없으면 바로 이동
      router.push('/staff/profile');
    }
  };

  /**
   * 페이지 이탈 확인
   * 사용자가 확인 모달에서 "확인"을 선택한 경우 실행
   */
  const confirmLeave = () => {
    setConfirmModal(false);
    router.push('/staff/profile');
  };

  /**
   * 주소 드롭다운 토글 핸들러
   * - 로딩 중이 아닐 때만 드롭다운 열기/닫기 가능
   * @param e - 클릭 이벤트 (기본 동작 방지 필요)
   */
  const handleDropdownToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isLoading && !isProfileLoading) {
      setIsDropdownOpen((prev) => !prev);
    }
  };

  /**
   * 주소 선택 핸들러
   * - 드롭다운에서 주소를 선택했을 때 호출
   * @param value - 선택된 주소 값
   */
  const handleAddressSelect = (value: string) => {
    if (!isLoading && !isProfileLoading) {
      // handleChange를 통해 formData 업데이트
      handleChange({
        target: { name: 'address', value },
      } as React.ChangeEvent<HTMLInputElement>);
      // 선택 후 드롭다운 닫기
      setIsDropdownOpen(false);
    }
  };

  /**
   * form 제출 핸들러
   * - useUpdateProfile의 handleSubmit에 성공/실패 콜백 전달
   */
  const onSubmit = () => {
    handleSubmit(openSuccessModal, openErrorModal);
  };

  /**
   * 프로필 조회 에러 처리 effect
   * - 404가 아닌 에러만 모달로 표시
   * - 404는 신규 사용자로 간주하여 에러 처리하지 않음
   */
  useEffect(() => {
    // 404가 아닌 에러만 모달로 표시 (404는 신규 등록으로 처리)
    if (profileError && !isNotFound) {
      openErrorModal(profileError);
    }
  }, [profileError, isNotFound]);

  // 인증되지 않았을 때 (리다이렉트 중)
  if (!isAuthenticated) {
    return null;
  }

  // 현재 모달이 성공 모달인지 확인
  // 성공 메시지와 에러 모달 메시지가 같고, 성공 메시지가 비어있지 않으면 성공 모달
  const isSuccessModal =
    errorModal.message === successMessage && successMessage !== '';

  // form이 비활성화되어야 하는 상태 - Mutation 진행 중 또는 프로필 로딩 중
  const isFormDisabled = isLoading || isProfileLoading;

  return (
    <>
      <Head>
        <title>내 프로필 등록 | The-Julge</title>
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

          {/* Form - 모바일: 1열, 태블릿: 2열, 데스크탑: 3열 */}
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
                  className={formData.address ? 'text-black' : 'text-gray-40'}>
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
};

export default Register;
