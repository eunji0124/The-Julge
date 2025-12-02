import Head from 'next/head';

import ShopRegisterForm from '@/components/owner/ShopRegisterForm';

const ShopRegisterPage = () => {
  return (
    <>
      <Head>
        <title>가게 등록 | The-Julge</title>
        <meta name="description" content="가게 등록 페이지" />
      </Head>
      <ShopRegisterForm />
    </>
  );
};

export default ShopRegisterPage;
