import { useState } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { SignupRequest, UserType } from '@/api/types';
import AuthRedirect from '@/components/auth/AuthRedirect';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { cn } from '@/lib/utils';

// 회원 유형 옵션
const USER_TYPE_OPTIONS = [
  { type: UserType.EMPLOYEE, label: '알바님' },
  { type: UserType.EMPLOYER, label: '사장님' },
];

/**
 * 회원가입 페이지
 * - 이메일, 비밀번호 입력 및 검증
 * - 회원 유형 선택 (알바님/사장님)
 */
const Signup = () => {
  // form 상태 관리
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    userType: UserType.EMPLOYEE, // '알바님'으로 초기 표시
  });

  // form 입력값 에러 상태
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
  });

  // 폼 데이터 업데이트 함수
  const handleInputChange = (
    field: keyof typeof formData,
    value: string | UserType
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 에러 업데이트 함수
  const handleErrorChange = (
    field: keyof typeof formErrors,
    message: string
  ) => {
    setFormErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  };

  // 가입하기 버튼 비활성화 조건
  const isDisabled =
    !formData.email ||
    !formData.password ||
    !formData.passwordConfirm ||
    formData.password !== formData.passwordConfirm ||
    !!formErrors.email ||
    !!formErrors.password ||
    !!formErrors.passwordConfirm;

  // 회원 유형 옵션 버튼 렌더링 함수
  const renderUserTypeButton = (option: { type: UserType; label: string }) => {
    const isSelected = formData.userType === option.type;

    return (
      <button
        key={option.type}
        type="button"
        onClick={() => handleInputChange('userType', option.type)}
        className={cn(
          'flex flex-[1_0_0] flex-col items-start gap-2 rounded-[30px] border bg-white px-[41px] py-[13px] transition-all',
          isSelected ? 'border-red-50' : 'border-gray-30'
        )}>
        <div className="flex items-center justify-center gap-2">
          <div
            className={cn(
              'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
              isSelected ? 'border-red-50 bg-red-50' : 'border-gray-30'
            )}>
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

    // 모든 필드에 대한 유효성 검사 수행
    const newErrors = {
      email: '',
      password: '',
      passwordConfirm: '',
    };
    let formIsValid = true;

    if (!formData.email) {
      newErrors.email = '값을 입력해 주세요.';
      formIsValid = false;
    } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '이메일 형식으로 작성해 주세요.';
      formIsValid = false;
    }

    if (!formData.password) {
      newErrors.password = '값을 입력해 주세요.';
      formIsValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = '8자 이상 입력해 주세요.';
      formIsValid = false;
    }

    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = '값을 입력해 주세요.';
      formIsValid = false;
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
      formIsValid = false;
    }

    setFormErrors(newErrors);

    if (!formIsValid) {
      return;
    }

    // 회원가입 로직 처리
    const signupData: SignupRequest = {
      email: formData.email,
      password: formData.password,
      type: formData.userType,
    };

    // TODO: API 호출 로직으로 대체 필요
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
          <Link href="/" className="mt-[73px] md:mt-[139px] lg:mt-[156px]">
            <Image
              src="/images/logo.svg"
              alt="The Julge 로고"
              width={208}
              height={38}
              className="md:h-[45px] md:w-[248px]"
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
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              error={formErrors.email}
              onValidate={(isValid, message) =>
                handleErrorChange('email', message)
              }
              placeholder="입력"
            />

            {/* 비밀번호 */}
            <Input
              type="password"
              label="비밀번호"
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              error={formErrors.password}
              onValidate={(isValid, message) =>
                handleErrorChange('password', message)
              }
              placeholder="입력"
            />

            {/* 비밀번호 확인 */}
            <Input
              type="password"
              label="비밀번호 확인"
              value={formData.passwordConfirm}
              onChange={(value) => handleInputChange('passwordConfirm', value)}
              matchValue={formData.password}
              error={formErrors.passwordConfirm}
              onValidate={(isValid, message) =>
                handleErrorChange('passwordConfirm', message)
              }
              placeholder="입력"
            />

            {/* 회원 유형 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                회원 유형
              </label>
              <div className="flex gap-4">
                {USER_TYPE_OPTIONS.map(renderUserTypeButton)}
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
