import '@/styles/globals.css';
import { useState } from 'react';

import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';

/**
 * Next.js App 컴포넌트 (쿠키 방식)
 * - React Query Provider 설정
 * - 전역 스타일 적용
 * - 토큰 검증은 서버에서 자동 처리
 */
const App = ({ Component, pageProps }: AppProps) => {
  // QueryClient를 컴포넌트 내부에서 생성 (SSR 이슈 방지)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            retry: 1,
            refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 비활성화
          },
          mutations: {
            retry: 0, // mutation은 재시도 안 함
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <Component {...pageProps} />
    </QueryClientProvider>
  );
};

export default App;
