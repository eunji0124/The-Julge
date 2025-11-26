import { useState } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { LoginRequest } from '@/api/types';
import AuthRedirect from '@/components/auth/AuthRedirect';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

const Login = () => {
  // form 상태 관리
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // form 입력값 에러 상태
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });

  // 폼 데이터 업데이트 함수
  const handleInputChange = (field: keyof typeof formData, value: string) => {
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

  // 로그인 하기 버튼 비활성화 조건
  const isDisabled =
    !formData.email ||
    !formData.password ||
    !!formErrors.email ||
    !!formErrors.password;

  // 로그인 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 모든 필드에 대한 유효성 검사
    const newErrors = {
      email: '',
      password: '',
    };
    let formIsValid = true;

    if (!formData.email) {
      newErrors.email = '값을 입력해 주세요.';
      formIsValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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

    setFormErrors(newErrors);

    if (!formIsValid) return;

    // 로그인 로직 처리
    const loginData: LoginRequest = {
      email: formData.email,
      password: formData.password,
    };

    // TODO: API 호출 로직으로 대체 필요
    console.log('로그인 데이터:', loginData);
  };

  return (
    <>
      <Head>
        <title>로그인 | The-Julge</title>
        <meta name="description" content="로그인 페이지입니다" />
      </Head>
      <div className="flex justify-center">
        <div className="flex w-full max-w-[350px] flex-col items-center justify-center">
          {/* 로고 */}
          <Link href="/" className="mt-[139px] md:mt-[279px] lg:mt-[312px]">
            <Image
              src="/images/logo.svg"
              alt="The Julge 로고"
              width={208}
              height={38}
              className="md:h-[45px] md:w-[248px]"
              priority
            />
          </Link>

          {/* 로그인 폼 */}
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

            {/* 로그인 하기 버튼 */}
            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={isDisabled}>
              로그인 하기
            </Button>
          </form>

          {/* 회원가입 링크 */}
          <AuthRedirect variant="login" />
        </div>
      </div>
    </>
  );
};

export default Login;
