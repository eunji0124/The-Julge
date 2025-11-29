import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { UserType } from '@/api/types';
import { useIsEmployer, useIsEmployee } from '@/hooks/useCheckUserType';
import { useAuthStore } from '@/store/useAuthStore';

type UserRole = 'GUEST' | UserType.EMPLOYER | UserType.EMPLOYEE;

type NavLink = {
  label: string;
  href: string;
};

type NavButton = {
  label: string;
  action?: 'logout';
  isIcon?: boolean;
};

type NavItem = NavLink | NavButton;

const NAVIGATION: Record<UserRole, NavItem[]> = {
  GUEST: [
    { label: '로그인', href: '/login' },
    { label: '회원가입', href: '/signup' },
  ],
  [UserType.EMPLOYER]: [
    { label: '내 가게', href: '/' },
    { label: '로그아웃', action: 'logout' },
    { label: '알림', isIcon: true },
  ],
  [UserType.EMPLOYEE]: [
    { label: '내 프로필', href: '/' },
    { label: '로그아웃', action: 'logout' },
    { label: '알림', isIcon: true },
  ],
};

const TEXT_BUTTON_STYLE =
  'text-sm font-bold leading-normal sm:text-base sm:font-bold sm:leading-5';

const Header = () => {
  const router = useRouter();

  const { clearAuth } = useAuthStore();
  const isAuthenticated = true;
  //const { isAuthenticated, clearAuth } = useAuthStore();
  const isEmployer = true;
  useIsEmployer();
  const isEmployee = useIsEmployee();

  // 사용자 역할 결정
  const getUserRole = (): UserRole => {
    if (!isAuthenticated) return 'GUEST';
    if (isEmployer) return UserType.EMPLOYER;
    if (isEmployee) return UserType.EMPLOYEE;
    return 'GUEST';
  };

  const userRole = getUserRole();

  const getTextButtonClass = () => {
    console.log(userRole);
    return userRole === 'GUEST'
      ? `${TEXT_BUTTON_STYLE} sm:gap-10`
      : `${TEXT_BUTTON_STYLE} sm:gap-3 lg:gap-10`;
  };

  // 로그아웃
  const handleLogout = () => {
    clearAuth();
    // 공고 리스트 페이지로 이동
    router.push('/');
  };

  const renderNavItem = (item: NavItem, index: number) => {
    if ('href' in item) {
      return (
        <Link key={index} href={item.href} className={getTextButtonClass()}>
          {item.label}
        </Link>
      );
    }

    // 아이콘 버튼 (알림)
    if (item.isIcon) {
      return (
        <button
          key={index}
          onClick={() => console.log('알림')}
          className="inline-flex h-5 w-5 items-center justify-center sm:h-6 sm:w-6"
          aria-label={item.label}>
          <Image
            src="/images/notification.svg"
            alt="알림"
            width={18}
            height={18}
            className="sm:h-5 sm:w-5"
          />
        </button>
      );
    }

    // 텍스트 버튼 (로그아웃)
    return (
      <button
        key={index}
        onClick={handleLogout}
        className={getTextButtonClass()}>
        {item.label}
      </button>
    );
  };

  return (
    <header className="w-full bg-white">
      <nav className="grid grid-cols-[auto_1fr] grid-rows-[min-content_min-content] gap-y-4 px-5 py-2.5 sm:grid-cols-[auto_auto_auto] sm:gap-y-0 sm:px-8 sm:py-[15px]">
        {/* 로고 */}
        <Link
          href="/"
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

        {/* 검색 */}
        <search className="bg-gray-10 col-span-2 col-start-1 row-start-2 mx-auto w-full max-w-[450px] rounded-[10px] sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:mx-auto">
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
              placeholder="가게 이름으로 찾아보세요"
              className="color-gray-40 h-5 w-[233px] text-xs leading-4 font-normal focus:border-none focus:outline-none sm:text-sm sm:leading-[22px]"
            />
          </div>
        </search>

        {/* 우측 버튼들 */}
        <div className="col-start-2 row-start-1 ml-auto inline-flex w-fit items-center justify-end gap-4 sm:col-start-3 sm:ml-0 sm:justify-self-end">
          {NAVIGATION[userRole].map(renderNavItem)}
        </div>
      </nav>
    </header>
  );
};

export default Header;
