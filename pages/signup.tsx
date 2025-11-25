import { useState } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { SignupRequest, UserType } from '@/api/types';
import AuthRedirect from '@/components/auth/AuthRedirect';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

/**
 * 회원가입 페이지
 * - 이메일, 비밀번호 입력 및 검증
 * - 회원 유형 선택 (알바님/사장님)
 */
const Signup = () => {
  // form 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [userType, setUserType] = useState<UserType>(UserType.EMPLOYEE); // '알바님'으로 초기 표시

  // form 입력값 에러 상태
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');

  // 회원 유형 옵션
  const userTypeOptions = [
    { type: UserType.EMPLOYEE, label: '알바님' },
    { type: UserType.EMPLOYER, label: '사장님' },
  ];

  // '가입하기' 버튼 비활성화 조건
  const isDisabled = !!emailError || !!passwordError || !!passwordConfirmError;

  // 회원 유형 옵션 버튼 렌더링 함수
  const renderUserTypeButton = (option: { type: UserType; label: string }) => {
    const isSelected = userType === option.type;

    return (
      <button
        key={option.type}
        type="button"
        onClick={() => setUserType(option.type)}
        className={`flex flex-[1_0_0] flex-col items-start gap-2 rounded-[30px] border bg-white px-[41px] py-[13px] transition-all ${
          isSelected ? 'border-red-50' : 'border-gray-30'
        }`}>
        <div className="flex items-center justify-center gap-2">
          <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
              isSelected ? 'border-red-50 bg-red-50' : 'border-gray-30'
            }`}>
            {isSelected && (
              <Image
                src="/images/checked.svg"
                width={14}
                height={14}
                alt="회원 유형 선택 아이콘"
              />
            )}
          </div>
          <span className="text-sm leading-[22px]">{option.label}</span>
        </div>
      </button>
    );
  };

  // 회원가입 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 에러 확인
    if (emailError || passwordError || passwordConfirmError) return;

    // 빈 값 체크
    if (!email || !password || !passwordConfirm) {
      alert('모든 필드를 입력해주세요');
      return;
    }

    // 회원가입 로직 처리
    const signupData: SignupRequest = {
      email,
      password,
      type: userType,
    };

    console.log('회원가입 데이터:', signupData);
  };

  return (
    <>
      <Head>
        <title>회원가입 | The-Julge</title>
        <meta name="description" content="회원가입 페이지입니다" />
      </Head>
      <div className="flex justify-center">
        <div className="flex w-full max-w-[350px] flex-col items-center justify-center">
          {/* 로고 */}
          <Link href="/" className="mt-[73px]">
            <Image
              src="/images/logo.svg"
              alt="The Julge 로고"
              width={208}
              height={38}
              className="h-[38px] w-[208px] md:h-[45px] md:w-[248px] lg:h-[45px] lg:w-[248px]"
              priority
            />
          </Link>

          {/* 회원가입 폼 */}
          <form
            onSubmit={handleSubmit}
            className="mt-10 flex w-full flex-col gap-7">
            {/* 이메일 */}
            <Input
              type="email"
              label="이메일"
              value={email}
              onChange={setEmail}
              error={emailError}
              onValidate={(isValid, message) => setEmailError(message)}
              placeholder="입력"
            />

            {/* 비밀번호 */}
            <Input
              type="password"
              label="비밀번호"
              value={password}
              onChange={setPassword}
              error={passwordError}
              onValidate={(isValid, message) => setPasswordError(message)}
              placeholder="입력"
            />

            {/* 비밀번호 확인 */}
            <Input
              type="password"
              label="비밀번호 확인"
              value={passwordConfirm}
              onChange={setPasswordConfirm}
              matchValue={password}
              error={passwordConfirmError}
              onValidate={(isValid, message) =>
                setPasswordConfirmError(message)
              }
              placeholder="입력"
            />

            {/* 회원 유형 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                회원 유형
              </label>
              <div className="flex gap-4">
                {userTypeOptions.map(renderUserTypeButton)}
              </div>
            </div>

            {/* 가입하기 버튼 */}
            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={isDisabled}>
              가입하기
            </Button>
          </form>

          {/* 로그인 링크 */}
          <AuthRedirect variant="signup" />
        </div>
      </div>
    </>
  );
};

export default Signup;
