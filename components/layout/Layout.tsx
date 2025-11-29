import { ReactNode } from 'react';

import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
