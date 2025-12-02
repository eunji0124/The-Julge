// pages/index.tsx
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/staff/notices',
      permanent: false,
    },
  };
};

const Home = () => null;
export default Home;
