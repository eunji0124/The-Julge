import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

const BUTTON_STYLE =
  'bg-red-50 border border-red-50 text-white hover:bg-white hover:text-red-50 cursor-pointer px-5 py-3.5 text-sm rounded-[10px] sm:px-10';

const Custom404 = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>404 | The-Julge</title>
        <meta name="description" content="페이지를 찾을 수 없습니다" />
      </Head>
      <div className="flex max-h-max min-h-[calc(100vh-231px)] w-full flex-col items-center justify-center gap-4 sm:min-h-[calc(100vh-170px)] sm:gap-6">
        <Link href="/">
          <Image
            src="/images/logo.svg"
            alt="The Julge 로고"
            width={208}
            height={38}
            className="sm:h-[45px] sm:w-[248px]"
            priority
          />
        </Link>
        <h1 className="text-xl font-bold sm:text-2xl">
          404 - 페이지를 찾을 수 없습니다
        </h1>
        <p className="text-base sm:text-xl">
          요청하신 페이지가 존재하지 않습니다.
        </p>

        <div className="flex gap-10">
          <button onClick={() => router.push('/')} className={BUTTON_STYLE}>
            홈으로 이동
          </button>

          <button onClick={() => router.back()} className={BUTTON_STYLE}>
            이전 페이지
          </button>
        </div>
      </div>
    </>
  );
};

export default Custom404;
