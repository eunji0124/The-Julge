import { FilterValues } from '@/components/common/modal/DetailFilterModal';
import Pagination from '@/components/common/Pagination';
import { SortType } from '@/constants/notice';
import { TransformedNotice } from '@/utils/transformNotice';

import NoticeControls from './NoticeControls';
import NoticeGrid from './NoticeGrid';

interface NoticeSectionProps {
  title: string;
  notices: TransformedNotice[];
  totalCount: number;
  page: number;
  onPageChange: (page: number) => void;
  sortType: SortType;
  onSortChange: (sort: SortType) => void;
  onFilterApply: (filter: FilterValues) => void;
  filterValues: FilterValues;
  onNoticeClick: (shopId: string, noticeId: string) => void;
  itemsPerPage: number;
}

const NoticeSection = ({
  title,
  notices,
  totalCount,
  page,
  onPageChange,
  sortType,
  onSortChange,
  onFilterApply,
  filterValues,
  onNoticeClick,
  itemsPerPage,
}: NoticeSectionProps) => {
  return (
    <section className="mb-16">
      <div className="mx-auto max-w-[964px] px-3 py-10 sm:px-8 sm:py-15 lg:px-0">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[20px] font-bold text-black sm:text-[28px]">
            {title}
          </h2>
          <NoticeControls
            sortType={sortType}
            onSortChange={onSortChange}
            onFilterApply={onFilterApply}
            filterValues={filterValues}
          />
        </div>

        {notices.length > 0 ? (
          <>
            <NoticeGrid notices={notices} onNoticeClick={onNoticeClick} />
            <Pagination
              total={totalCount}
              limit={itemsPerPage}
              page={page}
              setPage={onPageChange}
            />
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-gray-500">공고가 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default NoticeSection;
