import { useRouter } from 'next/router';

import Button from '@/components/common/Button';

/**
 * EmptyProfileState 사용 예제
 *
 * import EmptyProfileState from '@/components/profile/EmptyProfileState';
 *
 * const Ex = () => {
 *   return (
 *     <div>
 *      <EmptyProfileState
 *        message="내 프로필을 등록하고 원하는 가게에 지원해 보세요."
 *        buttonText="내 프로필 등록하기"
 *        link='/staff/profile/register'/>
 *     </div>
 *   );
 * }
 *
 */

// EmptyProfileState 컴포넌트의 props 타입 정의
interface EmptyStateProps {
  message: string;
  buttonText?: string | undefined;
  link?: string | undefined;
}

const EmptyProfileState: React.FC<EmptyStateProps> = ({
  message,
  buttonText,
  link,
}) => {
  const router = useRouter();

  const handleButtonClick = () => {
    if (link) {
      router.push(link);
    }
  };

  return (
    <div
      className={`border-gray-20 flex w-full flex-col items-center justify-center rounded-xl border px-6 py-15 ${buttonText ? 'gap-4 sm:gap-6' : ''}`}>
      {/* 안내 메시지 */}
      <p className="text-sm leading-[22px] font-normal sm:text-base sm:leading-relaxed">
        {message}
      </p>

      {/* 액션 버튼 */}
      {buttonText && link && (
        <Button
          variant="primary"
          size="large"
          onClick={handleButtonClick}
          className="px-5 py-2.5 text-sm sm:h-[47px] sm:w-[346px] sm:max-w-[346px] sm:text-base sm:leading-5">
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default EmptyProfileState;
