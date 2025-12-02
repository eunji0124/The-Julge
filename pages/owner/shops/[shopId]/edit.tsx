import Head from 'next/head';

import ShopEditForm from '@/components/owner/ShopEditForm1';

const ShopEditPage = () => {
  return (
    <>
      <Head>
        <title>가게 정보 편집 | The-Julge</title>
        <meta name="description" content="가게 정보 편집 페이지" />
      </Head>

      <ShopEditForm />
    </>
  );
};

export default ShopEditPage;
