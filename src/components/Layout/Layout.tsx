import Head from 'next/head';

import TopBar from '@components/TopNavBar';
import Footer from '@components/BottomBar';

const Layout = ({ children }: React.PropsWithChildren<{ className: string }>) => {
  return (
    <div className='layout'>
      <Head>
        <title>DataMap</title>
        <meta name="description" content="SmartWhales Web Map" />
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TopBar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;