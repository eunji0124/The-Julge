import Image from 'next/image';
import Link from 'next/link';

/**
 * Footer 사용 예제
 *
 * import Footer from '@/components/Footer';
 *
 * function Layout({ children }) {
 *   return (
 *     <div>
 *       <main>{children}</main>
 *       <Footer />
 *     </div>
 *   );
 * }
 *
 */

// SNS 아이콘 크기 정의 상수
const SNS_ICON_SIZE = {
  width: 24,
  height: 24,
};

// SNS 링크의 공통 스타일 클래스
const SNS_LINK_CLASS =
  'inline-flex justify-center items-center w-[25px] h-[25px]';

// SNS 링크 정보 타입 정의
type SnsLinkItem = {
  href: string;
  alt: string;
  icon: string;
  target?: string;
  rel?: string;
};

// SNS 링크 목록 상수
const SNS_LINKS: SnsLinkItem[] = [
  {
    href: 'mailto:support@codeit.kr?subject=문의사항&body=안녕하세요',
    alt: '이메일',
    icon: '/images/email.svg',
  },
  {
    href: 'https://www.facebook.com/codeit.kr/',
    alt: '페이스북',
    icon: '/images/facebook.svg',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
  {
    href: 'https://www.instagram.com/codeit_kr/',
    alt: '인스타그램',
    icon: '/images/instagram.svg',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
];

const Footer = () => {
  return (
    <footer className="bg-gray-10 w-full text-gray-50">
      {/* 
        푸터 레이아웃:
        - 모바일: 2열 2행 그리드 (저작권 좌측 하단, 메뉴 상단, SNS 우측 상단)
        - 태블릿 이상: 3열 1행 그리드 (저작권, 메뉴, SNS를 가로로 배치)
      */}
      <div className="grid grid-cols-[1fr_auto] grid-rows-[min-content_min-content] flex-col items-start gap-y-10 px-5 pt-8 pb-4 sm:grid-cols-[1fr_auto_1fr] sm:gap-y-0 sm:px-8 sm:py-[37px] lg:px-[238px] lg:py-[37px]">
        {/* 저작권 표시 영역 */}
        <span className="col-start-1 row-start-2 text-xs leading-4 font-normal sm:col-start-auto sm:row-start-auto sm:text-base sm:leading-relaxed">
          &copy;codeit - {new Date().getFullYear()}
        </span>

        {/* 푸터 메뉴 네비게이션 (Privacy Policy, FAQ) */}
        <nav className="flex justify-start gap-[30px] text-sm leading-[22px] font-normal sm:justify-center sm:text-base">
          <Link href="/" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/" className="hover:underline">
            FAQ
          </Link>
        </nav>

        {/* SNS 링크 네비게이션 (이메일, 페이스북, 인스타그램) */}
        <nav className="flex justify-end gap-2.5">
          {SNS_LINKS.map((link) => (
            <a
              key={link.alt}
              href={link.href}
              target={link.target}
              rel={link.rel}
              className={SNS_LINK_CLASS}>
              <Image
                src={link.icon}
                alt={link.alt}
                width={SNS_ICON_SIZE.width}
                height={SNS_ICON_SIZE.height}
              />
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
