import { fetchNoticeList, FetchNoticeListParams } from '@/apis/notices';
import { FetchNoticesOptions, NoticeListResult } from '@/types/notice';
import { getSortParams, buildFilterParams } from '@/utils/noticeHelpers';
import { transformNoticeData } from '@/utils/transformNotice';

export const fetchNotices = async (
  options: FetchNoticesOptions
): Promise<NoticeListResult> => {
  const { page, limit, sortType, filterValues, keyword } = options;

  const sortParams = getSortParams(sortType);
  const filterParams = buildFilterParams(filterValues);

  const params: FetchNoticeListParams = {
    offset: (page - 1) * limit,
    limit,
    ...sortParams,
    ...filterParams,
    ...(keyword && { keyword }),
  };

  const data = await fetchNoticeList(params);

  return {
    notices: data.items.map(({ item }) => transformNoticeData(item)),
    total: data.count,
  };
};

export const fetchCustomNotices = async () => {
  const data = await fetchNoticeList({
    offset: 0,
    limit: 3,
    sort: 'pay',
    order: 'desc',
  });

  return data.items.map(({ item }) => transformNoticeData(item));
};
