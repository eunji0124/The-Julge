import Head from 'next/head';

import Table from '@/components/common/Table';
import EmptyProfileState from '@/components/profile/EmptyProfileState';
import UserProfileCard from '@/components/profile/UserProfileCard';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useUserApplications } from '@/hooks/useUserApplications';
import { useUserProfile } from '@/hooks/useUserProfile';
import { transformEmployeeData } from '@/lib/utils/transformTableData';
import { useAuthStore } from '@/store/useAuthStore';

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
    link: '/staff/notices',
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
 * - 유저의 지원 목록 조회 및 표시
 */
const Profile = () => {
  // 인증 체크: 로그인하지 않은 경우 /login으로 리다이렉트
  const { isAuthenticated } = useAuthRedirect('/login');

  // Zustand에서 user 정보 가져오기
  const { user } = useAuthStore();

  // 프로필 데이터 조회
  const { profile, isLoading, error } = useUserProfile();

  // 지원 목록 조회 - 프로필이 있을 때만 활성화
  const {
    applications,
    isLoading: applicationsLoading,
    error: applicationsError,
  } = useUserApplications({
    userId: user?.id,
    enabled: !!profile, // 프로필이 있을 때만 지원 목록 조회
  });

  /**
   * 프로필 상태에 따른 콘텐츠를 반환하는 함수
   *
   * @returns 프로필 데이터, 로딩 상태, 에러 상태에 따른 React 노드
   */
  const getProfileContent = (): React.ReactNode => {
    // 프로필 데이터가 있을 때 - 실제 프로필 정보 표시
    if (profile) return <UserProfileCard profile={profile} />;

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

    // EmptyProfileState 렌더링
    return (
      <EmptyProfileState
        message={currentMessage}
        buttonText={data.buttonText}
        link={data.link}
      />
    );
  };

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

  // 인증되지 않았을 때 (리다이렉트 중)
  if (!isAuthenticated) {
    return null;
  }

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
          {getProfileContent()}
        </div>

        {/* 신청 내역  */}
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
