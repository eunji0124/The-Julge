import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { UserType } from '@/api/types';
import NotificationModal from '@/components/common/notification/NotificationModal';
import { useIsEmployer, useIsEmployee } from '@/hooks/useCheckUserType';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * Header 사용 예제
 *
 * import Footer from '@/components/Header';
 *
 * function Layout({ children }) {
 *   return (
 *     <div>
 *       <Header />
 *       <main>{children}</main>
 *     </div>
 *   );
 * }
 *
 */

// 사용자 역할 타입 정의 (게스트, 사장님, 알바님)
type UserRole = 'GUEST' | UserType.EMPLOYER | UserType.EMPLOYEE;

// 링크형 네비게이션 아이템 (href 속성 포함)
type NavLink = {
  label: string;
  href: string;
};

// 버튼형 네비게이션 아이템 (action 또는 아이콘 속성 포함)
type NavButton = {
  label: string;
  action?: 'logout';
  isIcon?: boolean;
};

// 네비게이션 아이템 통합 타입
type NavItem = NavLink | NavButton;

// 사용자 역할별 네비게이션 메뉴 구성
const NAVIGATION: Record<UserRole, NavItem[]> = {
  GUEST: [
    { label: '로그인', href: '/login' },
    { label: '회원가입', href: '/signup' },
  ],
  [UserType.EMPLOYER]: [
    { label: '내 가게', href: '/owner/shops' },
    { label: '로그아웃', action: 'logout' },
    { label: '알림', isIcon: true },
  ],
  [UserType.EMPLOYEE]: [
    { label: '내 프로필', href: '/staff/profile' },
    { label: '로그아웃', action: 'logout' },
    { label: '알림', isIcon: true },
  ],
};

// 텍스트 버튼 공통 스타일
const TEXT_BUTTON_STYLE =
  'text-sm font-bold leading-normal sm:text-base sm:font-bold sm:leading-5';

const Header = () => {
  const router = useRouter();

  // 인증 상태 및 함수 가져오기
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const isEmployer = useIsEmployer();
  const isEmployee = useIsEmployee();

  // 알림 훅 사용
  const {
    isNotificationOpen,
    notifications,
    hasUnreadNotifications,
    toggleNotification,
    closeNotification,
    markAsRead,
  } = useNotifications();

  /**
   * 현재 사용자의 역할을 판별하는 함수
   * @returns {UserRole} 사용자 역할 (GUEST, EMPLOYER, EMPLOYEE)
   */
  const getUserRole = (): UserRole => {
    if (!isAuthenticated) return 'GUEST';
    if (isEmployer) return UserType.EMPLOYER;
    if (isEmployee) return UserType.EMPLOYEE;
    return 'GUEST';
  };

  const userRole = getUserRole();

  const shopId = user?.shop?.item.id;

  // 검색어 상태
  const [searchKeyword, setSearchKeyword] = useState('');

  /**
   * 로그아웃 처리 함수
   * - 인증 정보 초기화
   * - 공고 리스트 페이지로 리다이렉트
   */
  const handleLogout = () => {
    clearAuth();
    router.push('/staff/notices');
  };

  /**
   * 검색 처리 함수
   * - 전체 공고 검색 페이지로 이동하며 검색어를 쿼리 파라미터로 전달
   */
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      router.push(
        `/staff/notices?search=${encodeURIComponent(searchKeyword.trim())}`
      );
    }
  };

  /**
   * 네비게이션 아이템을 렌더링하는 함수
   * @param {NavItem} item - 렌더링할 네비게이션 아이템
   * @returns {JSX.Element} 렌더링된 컴포넌트
   */
  const renderNavItem = (item: NavItem) => {
    // Link 컴포넌트 렌더링 (href 속성이 있는 경우)
    if ('href' in item) {
      // Employer이고 shopId가 있으며 label이 '내 가게'인 경우 shopId를 href에 추가
      let linkHref = item.href;
      if (isEmployer && shopId && item.label === '내 가게') {
        linkHref = item.href + '/' + shopId;
      }

      return (
        <Link
          key={item.label}
          href={linkHref}
          className={`${TEXT_BUTTON_STYLE}`}>
          {item.label}
        </Link>
      );
    }

    // 아이콘 버튼 렌더링 (알림 아이콘)
    if (item.isIcon) {
      return (
        <div key={item.label} className="relative">
          <button
            onClick={toggleNotification}
            className="inline-flex h-5 w-5 items-center justify-center sm:h-6 sm:w-6"
            aria-label={item.label}>
            <Image
              src={
                hasUnreadNotifications
                  ? '/images/notificationActive.svg'
                  : '/images/notification.svg'
              }
              alt="알림"
              width={18}
              height={18}
              className="sm:h-5 sm:w-5"
            />
          </button>
          {isNotificationOpen && (
            <NotificationModal
              isOpen={isNotificationOpen}
              onClose={closeNotification}
              notifications={notifications}
              onReadNotification={markAsRead}
            />
          )}
        </div>
      );
    }

    // 텍스트 버튼 렌더링 (로그아웃 버튼)
    return (
      <button
        key={item.label}
        onClick={handleLogout}
        className={`${TEXT_BUTTON_STYLE}`}>
        {item.label}
      </button>
    );
  };

  return (
    <header className="w-full bg-white">
      {/* 
        네비게이션 레이아웃:
        - 모바일: 2열 2행 그리드 (로고/버튼 | 검색)
        - 태블릿 이상: 3열 1행 그리드 (로고 | 검색 | 버튼)
      */}
      <nav className="grid grid-cols-[auto_1fr] grid-rows-[min-content_min-content] gap-y-4 px-5 py-2.5 sm:grid-cols-[auto_auto_auto] sm:gap-y-0 sm:px-8 sm:py-[15px]">
        {/* 로고 영역 */}
        <Link
          href="/staff/notices"
          className="col-start-1 row-start-1 inline-flex h-[30px] w-fit items-center justify-center sm:h-10">
          <Image
            src="/images/logo.svg"
            alt="The Julge 로고"
            width={82}
            height={15}
            className="sm:h-5 sm:w-[109px]"
            priority
          />
        </Link>

        {/* 검색 입력 영역 */}
        <form
          onSubmit={handleSearchSubmit}
          role="search"
          className="bg-gray-10 col-span-2 col-start-1 row-start-2 mx-auto w-full max-w-[450px] rounded-[10px] sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:mx-auto">
          <div className="flex w-full items-center gap-2 p-2 sm:items-start sm:gap-2.5 sm:p-2.5">
            <Image
              src="/images/search.svg"
              alt="검색"
              width={20}
              height={20}
              className="h-5 w-5"
            />
            <input
              type="search"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="가게 이름으로 찾아보세요"
              className="text-gray-40 h-5 flex-1 text-xs leading-4 font-normal focus:border-none focus:outline-none sm:text-sm sm:leading-[22px]"
            />
          </div>
        </form>

        {/* 우측 네비게이션 버튼 영역 (로그인/로그아웃/알림 등) */}
        <div
          className={`col-start-2 row-start-1 ml-auto inline-flex w-fit items-center justify-end gap-4 sm:col-start-3 sm:ml-0 sm:justify-self-end ${userRole === 'GUEST' ? 'sm:gap-10' : 'sm:gap-3 lg:gap-10'}`}>
          {NAVIGATION[userRole].map(renderNavItem)}
        </div>
      </nav>
    </header>
  );
};

export default Header;
