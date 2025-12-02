import ShopRegisterForm from '@/components/owner/ShopRegisterForm';
import Head from "next/head";

export default function ShopRegisterPage() {
  return (
    <>
      <Head>
        <title>가게 등록 - The Julge</title>
      </Head>

      <ShopRegisterForm />
    </>
  );
}
