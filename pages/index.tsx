import Head from 'next/head';
import { useRouter } from 'next/router';

import LoadingOverlay from '@/components/common/LoadingOverlay';
import { FilterValues } from '@/components/common/modal/DetailFilterModal';
import CustomNoticeSection from '@/components/notice/CustomNoticeSection';
import NoticeSection from '@/components/notice/NoticeSection';
import { ITEMS_PER_PAGE } from '@/constants/notice';
import { useNoticeFilter } from '@/hooks/useNoticeFilter';
import { useNoticeList } from '@/hooks/useNoticeList';
import { useSearchTerm } from '@/hooks/useSearchTerm';

const NoticeListPage = () => {
  const router = useRouter();
  const searchTerm = useSearchTerm(router.query.search);

  // 필터/정렬 상태 관리
  const { filterValues, sortType, setFilterValues, setSortType } =
    useNoticeFilter();

  // 전체 공고 관리
  const allNotices = useNoticeList('all', {
    sortType,
    filterValues,
    itemsPerPage: ITEMS_PER_PAGE,
    enabled: !searchTerm,
  });

  // 검색 결과 관리
  const searchNotices = useNoticeList('search', {
    searchTerm,
    sortType,
    filterValues,
    itemsPerPage: ITEMS_PER_PAGE,
    enabled: !!searchTerm,
  });

  // 현재 활성화된 공고 목록 선택
  const activeNotices = searchTerm ? searchNotices : allNotices;

  const handleFilterApply = (values: FilterValues) => {
    setFilterValues(values);
    activeNotices.resetPage();
  };

  const handleNoticeClick = (shopId: string, noticeId: string) => {
    router.push(`/staff/shops?shopId=${shopId}&noticeId=${noticeId}`);
  };

  return (
    <>
      <Head>
        <title>{searchTerm ? `"${searchTerm}" 검색 결과` : '공고 목록'}</title>
        <meta name="description" content="공고 목록 페이지" />
      </Head>

      <div className="min-h-screen bg-white">
        <div className="pb-20">
          <LoadingOverlay isLoading={activeNotices.isLoading} />

          {searchTerm ? (
            <NoticeSection
              title={`"${searchTerm}"에 대한 공고 목록`}
              notices={activeNotices.notices}
              totalCount={activeNotices.totalCount}
              page={activeNotices.page}
              onPageChange={activeNotices.setPage}
              sortType={sortType}
              onSortChange={setSortType}
              onFilterApply={handleFilterApply}
              filterValues={filterValues}
              onNoticeClick={handleNoticeClick}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          ) : (
            <>
              <CustomNoticeSection onNoticeClick={handleNoticeClick} />

              <NoticeSection
                title="전체 공고"
                notices={activeNotices.notices}
                totalCount={activeNotices.totalCount}
                page={activeNotices.page}
                onPageChange={activeNotices.setPage}
                sortType={sortType}
                onSortChange={setSortType}
                onFilterApply={handleFilterApply}
                filterValues={filterValues}
                onNoticeClick={handleNoticeClick}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NoticeListPage;
