import { FetchNoticeListParams } from '@/apis/notices';
import { FilterValues } from '@/components/common/modal/DetailFilterModal';
import { SortType } from '@/constants/notice';

export const getSortParams = (sortType: SortType) => {
  const sortMap = {
    마감임박순: { sort: 'time' as const, order: 'asc' as const },
    시급많은순: { sort: 'pay' as const, order: 'desc' as const },
    시간적은순: { sort: 'hour' as const, order: 'asc' as const },
    가나다순: { sort: 'shop' as const, order: 'asc' as const },
  };
  return sortMap[sortType];
};

export const buildFilterParams = (
  filters: FilterValues
): Partial<FetchNoticeListParams> => {
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
};
