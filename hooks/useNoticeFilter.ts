import { useState } from 'react';

import { FilterValues } from '@/components/common/modal/DetailFilterModal';

type SortType = '마감임박순' | '시급많은순' | '시간적은순' | '가나다순';

export const useNoticeFilter = () => {
  const [filterValues, setFilterValues] = useState<FilterValues>({
    locations: [],
    startDate: '',
    amount: '',
  });
  const [sortType, setSortType] = useState<SortType>('마감임박순');

  return {
    filterValues,
    setFilterValues,
    sortType,
    setSortType,
  };
};
