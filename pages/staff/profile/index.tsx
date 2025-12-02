import EmptyProfileState from '@/components/profile/EmptyProfileState';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useUserProfile } from '@/hooks/useUserProfile';

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
    link: '/',
  },
};

// title 스타일 정의
const TITLE_STYLE =
  'text-xl font-bold leading-normal sm:text-[28px] sm:tracking-[0.56px]';

/**
 * 내 프로필 상세 페이지 컴포넌트
 *
 * 주요 기능:
 * - 로그인 여부 확인 및 리다이렉트
 * - 프로필 데이터 조회 및 표시
 * - 프로필 미등록 시 등록 유도
 * - 로딩 및 에러 상태 처리
 */
const Profile = () => {
  // 인증 체크: 로그인하지 않은 경우 /login으로 리다이렉트
  const { isAuthenticated } = useAuthRedirect('/login');

  // 프로필 데이터 조회
  const { profile, isLoading, error } = useUserProfile();

  // 인증되지 않았을 때 (리다이렉트 중)
  if (!isAuthenticated) {
    return null;
  }

  /**
   * 프로필 상태에 따른 콘텐츠를 반환하는 함수
   *
   * @returns 프로필 데이터, 로딩 상태, 에러 상태에 따른 React 노드
   */
  const getProfileContent = (): React.ReactNode => {
    // 프로필 데이터가 있을 때 - 실제 프로필 정보 표시
    if (profile) {
      return (
        <div className="lg:max-w-[964px px- 3 mx-auto flex flex-col items-start gap-4 py-10 sm:gap-6 sm:px-8 sm:py-15">
          {profile && <p>프로필 정보가 있습니다. (내용 렌더링 예정)</p>}
        </div>
      );
    }

    // 기본 상태 설정: 프로필이 없을 때 사용될 PROFILE 데이터 (등록 버튼 포함)
    let data = EMPTY_STATE_DATA.PROFILE;
    let currentMessage = data.message;

    // 로딩 중일 때 - 버튼 없이 로딩 메시지만 표시
    if (isLoading) {
      data = EMPTY_STATE_DATA.LOADING;
      currentMessage = data.message;
    }

    // 에러 발생 시 - 프로필 등록 버튼과 함께 에러 메시지 표시
    if (error) {
      data = EMPTY_STATE_DATA.PROFILE;
      const errorMessage = error || EMPTY_STATE_DATA.ERROR.message;
      currentMessage = `에러 발생: ${errorMessage}`;
    }

    // EmptyProfileState 렌더링 (로딩, isNotFound, 에러 상태 통합)
    return (
      <EmptyProfileState
        message={currentMessage}
        buttonText={data.buttonText}
        link={data.link}
      />
    );
  };

  return (
    <div className="max-h-max min-h-[calc(100vh-231px)] sm:min-h-[calc(100vh-170px)]">
      {/* 내 프로필 */}
      <div className="lg:max-w-[964px px- 3 mx-auto flex flex-col items-start gap-4 py-10 sm:gap-6 sm:px-8 sm:py-15">
        <h2 className={TITLE_STYLE}>내 프로필</h2>
        {getProfileContent()}
      </div>
    </div>
  );
};

export default Profile;
