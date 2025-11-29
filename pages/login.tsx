import { useState } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { isAxiosError } from 'axios';

import { ApiErrorResponse, LoginRequest } from '@/api/types';
import AuthRedirect from '@/components/auth/AuthRedirect';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import ErrorModal from '@/components/common/modal/ErrorModal';
import useLogin from '@/hooks/useLogin';

const Login = () => {
  // API 메시지
  const [apiMessage, setApiMessage] = useState('');
  // Modal 표시 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // seLogin 훅 호출 → mutation 객체 반환
  const loginMutation = useLogin();

  // 로딩 상태 (mutation의 isPending 사용)
  const isLoading = loginMutation.isPending;

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
    !!formErrors.password ||
    isLoading;

  // 로그인 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 로딩 중이면 중복 요청 방지
    if (isLoading) return;

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

    const loginData: LoginRequest = {
      email: formData.email,
      password: formData.password,
    };

    // 로그인 API 호출
    loginMutation.mutate(loginData, {
      onError: (error) => {
        // 404 에러 (비밀번호 또는 이메일 불일치) 체크
        if (isAxiosError<ApiErrorResponse>(error) && error.response) {
          const statusCode = error.response.status;

          if (statusCode === 404) {
            setApiMessage('비밀번호가 일치하지 않습니다.');
            setIsModalOpen(true);
          }
        }
      },
    });
  };

  return (
    <>
      <Head>
        <title>로그인 | The-Julge</title>
        <meta name="description" content="로그인 페이지입니다" />
      </Head>
      <div className="flex h-screen w-screen justify-center p-5">
        <div className="flex w-full max-w-[350px] flex-col items-center justify-center">
          {/* 로고 */}
          <Link href="/">
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
              disabled={isLoading}
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
              disabled={isLoading}
            />

            {/* 로그인 하기 버튼 */}
            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={isDisabled}>
              {isLoading ? '로그인 중...' : '로그인 하기'}
            </Button>
          </form>

          {/* 회원가입 링크 */}
          <AuthRedirect variant="login" />
        </div>
      </div>

      {/* Error Modal */}
      {isModalOpen && (
        <ErrorModal
          message={apiMessage}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default Login;
