import { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/router';

import Button from '@/components/common/Button';
import Dropdown from '@/components/common/Dropdown';
import ConfirmModal from '@/components/common/modal/ConfirmModal';
import ErrorModal from '@/components/common/modal/ErrorModal';
import { SEOUL_DISTRICTS } from '@/constants/locations';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useProfileRegisterForm } from '@/hooks/useProfileRegisterForm';

const INPUT_BOX_STYLE =
  'flex w-full flex-col gap-2 text-base leading-relaxed font-normal';

const INPUT_STYLE =
  'border-gray-30 placeholder:text-gray-40 w-full rounded-md border px-5 py-4 focus:ring-2 focus:ring-red-50 focus:outline-none disabled:bg-gray-10 disabled:cursor-not-allowed';

const Register = () => {
  const router = useRouter();

  // 인증 체크
  const { isAuthenticated } = useAuthRedirect('/login');

  // 프로필 form 로직
  const {
    formData,
    isLoading,
    fetchError,
    hasFormChanged,
    handleChange,
    handleSubmit,
  } = useProfileRegisterForm();

  // Modal 상태
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
  const [confirmModal, setConfirmModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Dropdown 상태
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Modal 표시
  const openErrorModal = (message: string) => {
    setErrorModal({ isOpen: true, message });
  };

  const openSuccessModal = (message: string) => {
    setSuccessMessage(message);
    setErrorModal({ isOpen: true, message });
  };

  const closeModal = () => {
    setErrorModal({ isOpen: false, message: '' });
  };

  const closeSuccessModal = () => {
    setErrorModal({ isOpen: false, message: '' });
    setSuccessMessage('');
    router.push('/staff/profile');
  };

  // form 닫기 핸들러
  const handleClose = () => {
    if (hasFormChanged) {
      setConfirmModal(true);
    } else {
      router.push('/staff/profile');
    }
  };

  const confirmLeave = () => {
    setConfirmModal(false);
    router.push('/staff/profile');
  };

  // 드롭다운 핸들러
  const handleDropdownToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isLoading) {
      setIsDropdownOpen((prev) => !prev);
    }
  };

  const handleAddressSelect = (value: string) => {
    if (!isLoading) {
      handleChange({
        target: { name: 'address', value },
      } as React.ChangeEvent<HTMLInputElement>);
      setIsDropdownOpen(false);
    }
  };

  // form 제출
  const onSubmit = () => {
    handleSubmit(openSuccessModal, openErrorModal);
  };

  useEffect(() => {
    if (fetchError) {
      // 프로필 로딩 실패 에러 메시지가 있을 경우 ErrorModal 표시
      openErrorModal(fetchError);
    }
  }, [fetchError]);

  if (!isAuthenticated) {
    return null;
  }

  const isSuccessModal =
    errorModal.message === successMessage && successMessage !== '';

  return (
    <div className="bg-gray-05 max-h-max min-h-[calc(100vh-231px)] px-3 pt-10 pb-20 sm:min-h-[calc(100vh-170px)] sm:px-8 sm:py-15">
      <div className="mx-auto lg:max-w-[964px]">
        {/* 제목 및 닫기 버튼 */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold sm:text-[28px] sm:tracking-[0.56px]">
            내 프로필
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
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
          <div className={`${INPUT_BOX_STYLE}`}>
            <label htmlFor="name">이름*</label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="입력"
              disabled={isLoading}
              className={`${INPUT_STYLE}`}
            />
          </div>

          {/* 연락처 */}
          <div className={`${INPUT_BOX_STYLE}`}>
            <label htmlFor="phone">연락처*</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="입력"
              disabled={isLoading}
              className={`${INPUT_STYLE}`}
            />
          </div>

          {/* 선호 지역 */}
          <div className={`${INPUT_BOX_STYLE} relative`}>
            <label htmlFor="address">선호 지역</label>
            <button
              type="button"
              onClick={handleDropdownToggle}
              disabled={isLoading}
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

            {isDropdownOpen && !isLoading && (
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
              disabled={isLoading}
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
            disabled={isLoading || !hasFormChanged}>
            {isLoading ? '처리중...' : '등록하기'}
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
  );
};

export default Register;
