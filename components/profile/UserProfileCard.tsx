import React from 'react';

import Image from 'next/image';
import { useRouter } from 'next/router';

import Button from '@/components/common/Button';
import { UserProfile } from '@/hooks/useUserProfile';

interface UserProfileCardProps {
  profile: UserProfile;
}

const PROFILE_INFO_BASE_STYLE =
  'text-sm font-normal leading-[22px] sm:text-base sm:leading-relaxed';

const PROFILE_INFO_SUB_STYLE = `
  ${PROFILE_INFO_BASE_STYLE}
  flex gap-1.5 text-gray-50 
`;

const UserProfileCard: React.FC<UserProfileCardProps> = ({ profile }) => {
  const router = useRouter();

  const { name, phone, address, bio } = profile;

  // bio의 줄바꿈 처리 함수
  const formatBio = (text: string) => {
    return text.split(/\n|<br>|<br\/>/gi).map((line, index, array) => (
      <React.Fragment key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="bg-red-10 flex h-fit w-full max-w-[665px] items-start justify-between rounded-xl p-5 sm:p-8">
      {/* 프로필 영역 */}
      <div className="flex flex-col gap-5 sm:gap-7">
        <div className="flex flex-col gap-2 sm:gap-3">
          {/* 이름 */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-red-50 sm:text-base sm:leading-5">
              이름
            </span>
            <h2 className="text-2xl leading-normal font-bold tracking-[0.48px] sm:text-3xl sm:tracking-[0.56px]">
              {name}
            </h2>
          </div>
          {/* 연락처*/}
          <div className={PROFILE_INFO_SUB_STYLE}>
            <Image
              src="/images/phone.svg"
              width={16}
              height={16}
              alt="연락처"
              className="sm:h-5 sm:w-5"
            />
            <span>{phone}</span>
          </div>
          {/* 선호 지역 */}
          <div className={PROFILE_INFO_SUB_STYLE}>
            <Image
              src="/images/location.svg"
              width={16}
              height={16}
              alt="선호 지역"
              className="sm:h-5 sm:w-5"
            />
            <span>선호 지역: {address}</span>
          </div>
        </div>
        {/* 소개 */}
        <div className={PROFILE_INFO_BASE_STYLE}>{formatBio(bio)}</div>
      </div>

      {/* 버튼 영역 */}
      <Button
        variant="secondary"
        size="medium"
        onClick={() => {
          router.push('/staff/profile/register');
        }}
        className="px-5 py-2.5 sm:h-12 sm:w-[169px] sm:max-w-[169px] sm:text-base sm:leading-5">
        편집하기
      </Button>
    </div>
  );
};

export default UserProfileCard;
