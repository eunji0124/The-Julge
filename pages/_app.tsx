import '@/styles/globals.css';
import { useState } from 'react';

import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';

import Layout from '@/components/layout/Layout';

// 레이아웃을 제외할 페이지 경로 정의 상수
const EXCLUDED_PATHS = ['/login', '/signup'];

/**
 * Next.js App 컴포넌트
 * - React Query Provider 설정
 * - 전역 스타일 적용
 */
const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

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

  // 레이아웃을 제외할 페이지 경로
  const shouldShowLayout = !EXCLUDED_PATHS.includes(router.pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      {shouldShowLayout ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
    </QueryClientProvider>
  );
};

export default App;
