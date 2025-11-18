import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => {
  return (
    <Html lang="ko">
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <title>The-Julge</title>
        <meta
          name="description"
          content="지역 기반 맞춤 공고 플랫폼 — 내 근처 공고를 빠르게 확인하세요."
        />
        <meta
          name="keywords"
          content="알바, 공고, 지역 기반, 맞춤 공고, The Julge"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
