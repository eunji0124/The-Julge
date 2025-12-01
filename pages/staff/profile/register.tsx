import { useCallback, useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/router';

import { isAxiosError } from 'axios';

import { ApiErrorResponse } from '@/api/types';
import users from '@/api/users';
import Button from '@/components/common/Button';
import Dropdown from '@/components/common/Dropdown';
import ErrorModal from '@/components/common/modal/ErrorModal';
import { SEOUL_DISTRICTS } from '@/constants/locations';
import { useAuthStore } from '@/store/useAuthStore';

// Modal 메시지 상수
const MODAL_MESSAGES = {
  REQUIRED_NAME: '이름을 입력해주세요.',
  REQUIRED_PHONE: '연락처를 입력해주세요.',
  REQUIRED_LOGIN: '로그인이 필요합니다.',
  SUCCESS: '등록이 완료되었습니다.',
  ERROR_DEFAULT: '등록에 실패했습니다.',
  ERROR_ADDRESS: '시군구 주소가 올바르지 않습니다.',
  ERROR_FORBIDDEN: '권한이 없습니다',
  ERROR_NOT_FOUND: '존재하지 않는 사용자입니다',
  PROCESSING_ERROR: '프로필 등록 처리 중 오류가 발생했습니다.',
};

// Modal 상태 타입
interface ModalState {
  isOpen: boolean;
  message: string;
}

// 입력 박스 공통 스타일
const INPUT_BOX_STYLE =
  'flex w-full flex-col gap-2 text-base leading-relaxed font-normal';

// 입력 공통 스타일
const INPUT_STYLE =
  'border-gray-30 placeholder:text-gray-40 w-full rounded-md border px-5 py-4 focus:ring-2 focus:ring-red-50 focus:outline-none';

const Register = () => {
  const router = useRouter();

  // form 상태 관리
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    bio: '',
  });
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  // Modal 상태
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    message: '',
  });
  // Dropdown 표시 상태
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // 로그인한 유저 정보
  const user = useAuthStore((state) => state.user);
  // 로그인 여부
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 리다이렉트 추적용 ref
  const hasRedirected = useRef(false);

  // hydration 대기
  useEffect(() => {
    setIsReady(true);
  }, []);

  // 인증 확인: 준비가 완료된 후에만 리다이렉트
  useEffect(() => {
    if (isReady && !isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace('/login');
    }
  }, [isReady, isAuthenticated, router]);

  // 유저 프로필 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        try {
          const response = await users.getUser(user.id);
          const userData = response.item;

          // 기존 데이터가 있으면 폼에 채우기
          setFormData({
            name: userData.name || '',
            phone: userData.phone || '',
            address: userData.address || '',
            bio: userData.bio || '',
          });
        } catch (error) {
          console.error('사용자 정보 조회 실패:', error);
        }
      }
    };

    fetchUserData();
  }, [user?.id]);

  // Modal 표시
  const openModal = (message: string) => {
    setModal({ isOpen: true, message });
  };

  // Modal 닫기
  const closeModal = () => {
    setModal({ isOpen: false, message: '' });
    if (modal.message === MODAL_MESSAGES.SUCCESS) {
      router.push('/staff/profile');
    }
  };

  // Dropdown 버튼 클릭 처리
  const handleDropdownToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDropdownOpen((prev) => !prev);
  };

  // Dropdown 닫기
  const handleDropdownClose = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  // 지역 선택 처리
  const handleAddressSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, address: value }));
    setIsDropdownOpen(false);
  };

  // 입력 필드 변경 처리
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 내 프로필 등록 처리
  const handleSubmit = async () => {
    // 필수 입력 항목 검증
    if (!formData.name.trim()) {
      openModal(MODAL_MESSAGES.REQUIRED_NAME);
      return;
    }
    if (!formData.phone.trim()) {
      openModal(MODAL_MESSAGES.REQUIRED_PHONE);
      return;
    }

    // 사용자 인증 확인
    if (!user?.id) {
      openModal(MODAL_MESSAGES.REQUIRED_LOGIN);
      return;
    }

    setIsLoading(true);

    try {
      await users.updateUser(user.id, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        bio: formData.bio || '',
      });

      setIsLoading(false);
      openModal(MODAL_MESSAGES.SUCCESS);
    } catch (error) {
      setIsLoading(false);
      let errorMessage = MODAL_MESSAGES.ERROR_DEFAULT;

      // API 에러 상태 코드에 따른 메시지 처리
      if (isAxiosError<ApiErrorResponse>(error) && error.response) {
        const status = error.response?.status;

        if (status === 403) {
          errorMessage = MODAL_MESSAGES.ERROR_FORBIDDEN;
        } else if (status === 404) {
          errorMessage = MODAL_MESSAGES.ERROR_NOT_FOUND;
        } else if (error.response?.data?.message) {
          if (
            error.response.data.message.includes(MODAL_MESSAGES.ERROR_ADDRESS)
          ) {
            errorMessage = MODAL_MESSAGES.ERROR_ADDRESS;
          } else {
            errorMessage = error.response.data.message;
          }
        }
      } else {
        // Axios 에러가 아니거나, 응답이 없는 예상치 못한 에러는 별도 처리
        errorMessage = MODAL_MESSAGES.PROCESSING_ERROR;
      }

      openModal(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 인증되지 않은 경우 렌더링 방지
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-gray-05 max-h-max min-h-[calc(100vh-231px)] px-3 pt-10 pb-20 sm:min-h-[calc(100vh-170px)] sm:px-8 sm:py-15">
      <div className="mx-auto lg:max-w-[964px]">
        {/* 제목 및 닫기 버튼 */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold sm:text-[28px] sm:tracking-[0.56px]">
            내 프로필
          </h2>
          <button
            onClick={() => router.push('/staff/profile')}
            className="flex h-6 w-6 items-center justify-center sm:h-8 sm:w-8">
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
              className={`${INPUT_STYLE}`}
            />
          </div>

          {/* 선호 지역 */}
          <div className={`${INPUT_BOX_STYLE} relative`}>
            <label htmlFor="address">선호 지역</label>
            <button
              type="button"
              onClick={handleDropdownToggle}
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
                  className=""
                />
              ) : (
                <Image
                  src="/images/dropdownClose.svg"
                  width={16}
                  height={16}
                  alt="선호 지역 드롭다운 닫기"
                  className=""
                />
              )}
            </button>

            {isDropdownOpen && (
              <Dropdown
                items={[...SEOUL_DISTRICTS]}
                selected={formData.address}
                onSelect={handleAddressSelect}
                onClose={handleDropdownClose}
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
              className={`${INPUT_STYLE} resize-none`}
            />
          </div>
        </div>

        {/* 등록하기 버튼 */}
        <div className="align-center flex w-full justify-center">
          <Button
            variant="primary"
            size="large"
            onClick={handleSubmit}
            disabled={isLoading}>
            {isLoading ? '처리중...' : '등록하기'}
          </Button>
        </div>
      </div>

      {/* Modal */}
      {modal.isOpen && (
        <ErrorModal message={modal.message} onClose={closeModal} />
      )}
    </div>
  );
};

export default Register;
