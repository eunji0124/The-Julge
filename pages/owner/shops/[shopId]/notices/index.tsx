import Head from 'next/head';
import { useRouter } from 'next/router';

import NoticeDetailComponent from '@/components/owner/NoticeDetail';
import PostNoticeComponent from '@/components/owner/PostNotice';

const NoticesPage = () => {
  const router = useRouter();
  const { noticeId } = router.query;

  const isDetailView = !!noticeId;

  return (
    <>
      <Head>
        <title>{isDetailView ? '공고 상세' : '공고 등록'} | The-Julge</title>
        <meta
          name="description"
          content={`공고 ${isDetailView ? '상세' : '등록'} 페이지`}
        />
      </Head>

      {isDetailView ? <NoticeDetailComponent /> : <PostNoticeComponent />}
    </>
  );
};

export default NoticesPage;
