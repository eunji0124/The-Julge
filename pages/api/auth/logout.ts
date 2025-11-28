import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * 로그아웃 API Route
 * - HttpOnly Cookie 삭제
 */
const logoutHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // 쿠키 삭제 (Max-Age=0)
  const isProduction = process.env.NODE_ENV === 'production';
  res.setHeader('Set-Cookie', [
    `token=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${isProduction ? '; Secure' : ''}`,
  ]);

  res.status(200).json({ message: '로그아웃 성공' });
};

export default logoutHandler;
