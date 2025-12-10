import { useState, useEffect, useCallback } from 'react';

import { FilterValues } from '@/components/common/modal/DetailFilterModal';
import { SortType } from '@/constants/notice';
import { fetchNotices } from '@/lib/noticeService';
import { TransformedNotice } from '@/utils/transformNotice';

interface UseNoticeListOptions {
  searchTerm?: string;
  sortType: SortType;
  filterValues: FilterValues;
  itemsPerPage: number;
  enabled?: boolean;
}

export const useNoticeList = (
  type: 'all' | 'search',
  options: UseNoticeListOptions
) => {
  const {
    searchTerm,
    sortType,
    filterValues,
    itemsPerPage,
    enabled = true,
  } = options;

  const [page, setPage] = useState(1);
  const [notices, setNotices] = useState<TransformedNotice[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadNotices = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    try {
      const result = await fetchNotices({
        page,
        limit: itemsPerPage,
        sortType,
        filterValues,
        keyword: type === 'search' ? searchTerm : undefined,
      });

      setNotices(result.notices);
      setTotalCount(result.total);
    } catch (error) {
      console.error(`${type} 공고 로딩 실패:`, error);
      setNotices([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, sortType, filterValues, searchTerm, itemsPerPage, enabled, type]);

  // 필터/정렬 변경 시 페이지 리셋
  useEffect(() => {
    setPage(1);
  }, [sortType, filterValues]);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  return {
    page,
    setPage,
    notices,
    totalCount,
    isLoading,
    reload: loadNotices,
    resetPage,
  };
};
