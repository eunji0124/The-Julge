import { FilterValues } from '@/components/common/modal/DetailFilterModal';
import { SortType } from '@/constants/notice';
import { TransformedNotice } from '@/utils/transformNotice';

export interface FetchNoticesOptions {
  page: number;
  limit: number;
  sortType: SortType;
  filterValues: FilterValues;
  keyword?: string;
}

export interface NoticeListResult {
  notices: TransformedNotice[];
  total: number;
}
