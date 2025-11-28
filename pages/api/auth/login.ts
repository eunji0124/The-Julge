import { isAxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

import tokenApi from '@/api/token';
import { ApiErrorResponse, LoginRequest } from '@/api/types';

// 7일 유효기간 정의
const ONE_WEEK = 60 * 60 * 24 * 7;

/**
 * 로그인 API Route
 * - 백엔드 API 호출
 * - 토큰을 HttpOnly Cookie에 저장
 * - 사용자 정보만 응답으로 반환
 */
const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    const loginData: LoginRequest = {
      email,
      password,
    };

    // 실제 백엔드 API 호출
    const response = await tokenApi.login(loginData);

    const { token, user } = response.item;

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieFlags = `HttpOnly; SameSite=Strict; Path=/; Max-Age=${ONE_WEEK}`;
    const secureFlag = isProduction ? ' Secure' : ''; // 프로덕션에서만 Secure 추가

    // HttpOnly Cookie에 토큰 저장 (보안)
    res.setHeader('Set-Cookie', [`token=${token};${cookieFlags}${secureFlag}`]);

    // 사용자 정보만 클라이언트에 반환
    res.status(200).json({ user: user.item });
  } catch (error: unknown) {
    console.error('로그인 에러:', error);

    if (isAxiosError<ApiErrorResponse>(error) && error.response) {
      const errorMessage =
        error.response?.data?.message || '로그인에 실패했습니다.';
      const statusCode = error.response?.status || 500;

      res.status(statusCode).json({ message: errorMessage });
    } else {
      res.status(500).json({ message: '알 수 없는 오류가 발생했습니다.' });
    }
  }
};

export default loginHandler;
