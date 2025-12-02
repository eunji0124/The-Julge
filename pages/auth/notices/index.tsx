import { useState, useEffect, useCallback, useMemo } from 'react';

import { useRouter } from 'next/router';

import { fetchNoticeList, FetchNoticeListParams } from '@/api/notices';
import Dropdown from '@/components/common/Dropdown';
import DetailFilterModal, {
  FilterValues,
} from '@/components/common/modal/DetailFilterModal';
import Pagination from '@/components/common/Pagination';
import Post from '@/components/post/Post';
import {
  transformNoticeData,
  TransformedNotice,
} from '@/utils/transformNotice';

type SortType = '마감임박순' | '시급많은순' | '시간적은순' | '가나다순';

const ITEMS_PER_PAGE = 6;
const SORT_OPTIONS: SortType[] = [
  '마감임박순',
  '시급많은순',
  '시간적은순',
  '가나다순',
];

// SortType을 백엔드 API 파라미터로 변환
const getSortParams = (
  sortType: SortType
): { sort: 'time' | 'pay' | 'hour' | 'shop'; order: 'asc' | 'desc' } => {
  switch (sortType) {
    case '마감임박순':
      return { sort: 'time', order: 'asc' };
    case '시급많은순':
      return { sort: 'pay', order: 'desc' };
    case '시간적은순':
      return { sort: 'hour', order: 'asc' };
    case '가나다순':
      return { sort: 'shop', order: 'asc' };
    default:
      return { sort: 'time', order: 'asc' };
  }
};

const NoticeListPage = () => {
  const router = useRouter();
  const { search: rawSearch } = router.query;

  // 페이지 상태
  const [allPage, setAllPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [totalAllCount, setTotalAllCount] = useState(0);
  const [totalSearchCount, setTotalSearchCount] = useState(0);

  // UI 상태
  const [sortType, setSortType] = useState<SortType>('마감임박순');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValues>({
    locations: [],
    startDate: '',
    amount: '',
  });

  // 데이터 상태
  const [allNotices, setAllNotices] = useState<TransformedNotice[]>([]);
  const [searchResults, setSearchResults] = useState<TransformedNotice[]>([]);
  const [customNotices, setCustomNotices] = useState<TransformedNotice[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  //필터 파라미터 구성 로직
  const buildFilterParams = useCallback(
    (filters: FilterValues): Partial<FetchNoticeListParams> => {
      const params: Partial<FetchNoticeListParams> = {};
      if (filters.locations.length > 0) {
        params.address = filters.locations;
      }
      if (filters.startDate) {
        params.startsAtGte = new Date(filters.startDate).toISOString();
      }
      if (filters.amount) {
        params.hourlyPayGte = parseInt(filters.amount, 10);
      }
      return params;
    },
    []
  );

  // 검색어 정규화
  const searchTerm = useMemo(() => {
    if (!rawSearch) return '';
    if (Array.isArray(rawSearch)) return rawSearch[0] ?? '';
    return rawSearch;
  }, [rawSearch]);

  // 맞춤 공고 불러오기 (시급 높은 순 3개)
  const loadCustomNotices = useCallback(async () => {
    try {
      const data = await fetchNoticeList({
        offset: 0,
        limit: 3,
        sort: 'pay',
        order: 'desc',
      });

      const transformed = data.items.map(({ item }) =>
        transformNoticeData(item)
      );

      setCustomNotices(transformed);
    } catch (error) {
      console.error('맞춤 공고 로딩 실패:', error);
      setCustomNotices([]);
    }
  }, []);

  useEffect(() => {
    loadCustomNotices();
  }, [loadCustomNotices]);

  // 전체 공고 불러오기
  const loadAllNotices = useCallback(async () => {
    setIsLoading(true);
    try {
      // 백엔드 정렬 파라미터 추가
      const sortParams = getSortParams(sortType);

      const baseParams: FetchNoticeListParams = {
        offset: (allPage - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        ...sortParams, // 백엔드 정렬 파라미터
      };

      const filterParams = buildFilterParams(filterValues);
      const params: FetchNoticeListParams = { ...baseParams, ...filterParams };

      const data = await fetchNoticeList(params);

      const transformed = data.items.map(({ item }) =>
        transformNoticeData(item)
      );

      // 백엔드에서 이미 정렬된 데이터이므로 클라이언트 정렬 불필요
      setAllNotices(transformed);
      setTotalAllCount(data.count);
    } catch (error) {
      console.error('공고 목록 로딩 실패:', error);
      setAllNotices([]);
      setTotalAllCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [allPage, filterValues, sortType, buildFilterParams]);

  // 검색 결과 불러오기
  const loadSearchResults = useCallback(async () => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // 백엔드 정렬 파라미터 추가
      const sortParams = getSortParams(sortType);

      const baseParams: FetchNoticeListParams = {
        offset: (searchPage - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        keyword: searchTerm,
        ...sortParams, // 백엔드 정렬 파라미터
      };

      const filterParams = buildFilterParams(filterValues);
      const params: FetchNoticeListParams = { ...baseParams, ...filterParams };

      const data = await fetchNoticeList(params);

      const transformed = data.items.map(({ item }) =>
        transformNoticeData(item)
      );

      // 백엔드에서 이미 정렬된 데이터이므로 클라이언트 정렬 불필요
      setSearchResults(transformed);
      setTotalSearchCount(data.count);
    } catch (error) {
      console.error('검색 결과 로딩 실패:', error);
      setSearchResults([]);
      setTotalSearchCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, searchPage, filterValues, sortType, buildFilterParams]);

  // 필터 또는 정렬 변경 시 페이지 리셋
  useEffect(() => {
    setAllPage(1);
    setSearchPage(1);
  }, [filterValues, sortType]);

  // 전체 공고 로드
  useEffect(() => {
    if (!searchTerm) loadAllNotices();
  }, [allPage, searchTerm, loadAllNotices]);

  // 검색 결과 로드
  useEffect(() => {
    if (searchTerm) loadSearchResults();
  }, [searchPage, searchTerm, loadSearchResults]);

  // 필터 적용 핸들러
  const handleFilterApply = (values: FilterValues) => {
    setFilterValues(values);
    setAllPage(1);
    setSearchPage(1);
  };

  // 정렬 선택 핸들러
  const handleSortSelect = useCallback((value: string) => {
    setSortType(value as SortType);
    setIsSortOpen(false);
  }, []);

  const handleSortDropdownToggle = useCallback(() => {
    setIsSortOpen((v) => !v);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="pb-20">
        {/* 로딩 오버레이 */}
        {isLoading && (
          <div className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-white">
            <div className="rounded-lg bg-white px-6 py-4 shadow-lg">
              <div className="text-lg font-medium text-gray-900">
                로딩 중...
              </div>
            </div>
          </div>
        )}

        {/* 검색 결과 영역 */}
        {searchTerm ? (
          <section className="mb-16">
            <div className="mx-auto max-w-[964px] px-3 py-10 sm:px-8 sm:py-15 lg:px-0">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-[20px] font-bold text-black sm:text-[28px]">
                  "{searchTerm}"에 대한 공고 목록
                </h2>
                <div className="relative flex items-center gap-2">
                  <div className="relative">
                    <button
                      onClick={handleSortDropdownToggle}
                      className="flex h-[42px] items-center gap-2 rounded-[10px] border border-gray-300 px-4 text-sm outline-none hover:border-gray-400">
                      <span>{sortType}</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`}>
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    {isSortOpen && (
                      <Dropdown
                        items={SORT_OPTIONS}
                        selected={sortType}
                        onSelect={handleSortSelect}
                        onClose={() => setIsSortOpen(false)}
                      />
                    )}
                  </div>
                  <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className="h-[42px] rounded-[10px] bg-[#FF5C3F] px-6 text-sm font-medium text-white hover:bg-[#FF4A2D]">
                    상세 필터
                  </button>
                  <DetailFilterModal
                    isOpen={isFilterModalOpen}
                    onClose={() => setIsFilterModalOpen(false)}
                    onApply={handleFilterApply}
                    initialValues={filterValues}
                  />
                </div>
              </div>

              {searchResults.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-3 pb-10 sm:gap-4 lg:grid-cols-3 lg:gap-6">
                    {searchResults.map((notice) => (
                      <Post
                        key={notice.id}
                        {...notice}
                        className="max-w-none"
                        onClick={() => {
                          router.push(
                            `/auth/shops/${notice.shopId}/notices/${notice.id}`
                          );
                        }}
                      />
                    ))}
                  </div>
                  <Pagination
                    total={totalSearchCount}
                    limit={ITEMS_PER_PAGE}
                    page={searchPage}
                    setPage={setSearchPage}
                  />
                </>
              ) : (
                <div className="py-20 text-center">
                  <p className="text-gray-500">검색 결과가 없습니다.</p>
                </div>
              )}
            </div>
          </section>
        ) : (
          <>
            {/* 맞춤 공고 영역 */}
            <section className="bg-red-10 mb-16 px-3 py-10 sm:px-8 sm:pt-15 lg:py-15">
              <div className="mx-auto max-w-[964px]">
                <h2 className="mb-6 px-4 text-[20px] font-bold text-black sm:px-0 sm:text-[28px]">
                  맞춤 공고
                </h2>
                {customNotices.length > 0 ? (
                  <>
                    {/* 모바일/태블릿: 가로 스크롤 */}
                    <div className="overflow-x-auto px-4 sm:px-0 lg:hidden">
                      <div className="flex gap-3 sm:gap-4">
                        {customNotices.map((notice) => (
                          <div
                            key={notice.id}
                            className="w-[calc(50vw-24px)] flex-shrink-0 sm:w-[calc(50vw-32px)]">
                            <Post
                              {...notice}
                              className="max-w-none"
                              onClick={() => {
                                router.push(
                                  `/auth/shops/${notice.shopId}/notices/${notice.id}`
                                );
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* 데스크탑: 그리드 */}
                    <div className="hidden grid-cols-3 gap-6 lg:grid">
                      {customNotices.map((notice) => (
                        <Post
                          key={notice.id}
                          {...notice}
                          className="max-w-none"
                          onClick={() => {
                            router.push(
                              `/auth/shops/${notice.shopId}/notices/${notice.id}`
                            );
                          }}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="py-10 text-center">
                    <p className="text-gray-500">맞춤 공고가 없습니다.</p>
                  </div>
                )}
              </div>
            </section>

            {/* 전체 공고 영역 */}
            <section>
              <div className="mx-auto max-w-[964px] px-3 py-10 sm:px-8 sm:pt-15 lg:px-0 lg:pt-15">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-[20px] font-bold text-black sm:text-[28px]">
                    전체 공고
                  </h2>
                  <div className="relative flex items-center gap-2">
                    <div className="relative">
                      <button
                        onClick={handleSortDropdownToggle}
                        className="flex h-[42px] items-center gap-2 rounded-[10px] border border-gray-300 px-4 text-sm outline-none hover:border-gray-400">
                        <span>{sortType}</span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`}>
                          <path
                            d="M4 6L8 10L12 6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      {isSortOpen && (
                        <Dropdown
                          items={SORT_OPTIONS}
                          selected={sortType}
                          onSelect={handleSortSelect}
                          onClose={() => setIsSortOpen(false)}
                        />
                      )}
                    </div>
                    <button
                      onClick={() => setIsFilterModalOpen(true)}
                      className="h-[42px] rounded-[10px] bg-[#FF5C3F] px-6 text-sm font-medium text-white hover:bg-[#FF4A2D]">
                      상세 필터
                    </button>
                    <DetailFilterModal
                      isOpen={isFilterModalOpen}
                      onClose={() => setIsFilterModalOpen(false)}
                      onApply={handleFilterApply}
                      initialValues={filterValues}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pb-10 sm:gap-4 lg:grid-cols-3 lg:gap-6">
                  {allNotices.length > 0 ? (
                    allNotices.map((notice) => (
                      <Post
                        key={notice.id}
                        {...notice}
                        className="max-w-none"
                        onClick={() => {
                          router.push(
                            `/auth/shops/${notice.shopId}/notices/${notice.id}`
                          );
                        }}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 py-20 text-center lg:col-span-3">
                      <p className="text-gray-500">전체 공고가 없습니다.</p>
                    </div>
                  )}
                </div>

                <Pagination
                  total={totalAllCount}
                  limit={ITEMS_PER_PAGE}
                  page={allPage}
                  setPage={setAllPage}
                />
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default NoticeListPage;
