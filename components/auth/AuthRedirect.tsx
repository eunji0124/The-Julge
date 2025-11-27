import Link from 'next/link';

/**
 * AuthRedirect 사용 예제
 *
 * @example
 *  <AuthRedirect variant="login" />
 *  <AuthRedirect variant="signup" />
 *
 * @note
 * - 부모 요소의 너비에 꽉 차도록 설정됨 (w-full)
 * - 텍스트는 가운데 정렬됨 (justify-center, text-center)
 */

interface AuthRedirectProps {
  variant: 'login' | 'signup';
}

const AUTH_REDIRECT_CONFIG = {
  login: {
    text: '회원이 아니신가요?',
    linkText: '회원가입하기',
    href: '/signup',
    marginClass: 'mt-4 md:mt-5 lg:mt-5',
  },
  signup: {
    text: '이미 가입하셨나요?',
    linkText: '로그인하기',
    href: '/login',
    marginClass: 'mt-5 md:mt-5 lg:mt-4',
  },
};

const AuthRedirect = ({ variant }: AuthRedirectProps) => {
  const { text, linkText, href, marginClass } = AUTH_REDIRECT_CONFIG[variant];

  return (
    <div
      className={`text-gray-60 inline-flex w-full justify-center gap-2 text-center text-base font-normal ${marginClass}`}>
      <span>{text}</span>
      <Link
        className="text-purple-20 hover:text-purple-10 underline decoration-auto underline-offset-auto [text-decoration-skip-ink:none] [text-underline-position:from-font]"
        href={href}>
        {linkText}
      </Link>
    </div>
  );
};

export default AuthRedirect;
