import { useState } from 'react';

import Dropdown from '@/components/common/Dropdown';
import DetailFilterModal, {
  FilterValues,
} from '@/components/common/modal/DetailFilterModal';
import { SortType, SORT_OPTIONS } from '@/constants/notice';

interface NoticeControlsProps {
  sortType: SortType;
  onSortChange: (sort: SortType) => void;
  onFilterApply: (filter: FilterValues) => void;
  filterValues: FilterValues;
}

const NoticeControls = ({
  sortType,
  onSortChange,
  onFilterApply,
  filterValues,
}: NoticeControlsProps) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleSortSelect = (value: string) => {
    onSortChange(value as SortType);
    setIsSortOpen(false);
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* 정렬 드롭다운 */}
      <div className="relative">
        <button
          onClick={() => setIsSortOpen(!isSortOpen)}
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
            items={[...SORT_OPTIONS]}
            selected={sortType}
            onSelect={handleSortSelect}
            onClose={() => setIsSortOpen(false)}
          />
        )}
      </div>

      {/* 필터 버튼 */}
      <button
        onClick={() => setIsFilterModalOpen(true)}
        className="h-[42px] rounded-[10px] bg-[#FF5C3F] px-6 text-sm font-medium text-white hover:bg-[#FF4A2D]">
        상세 필터
      </button>

      {/* 필터 모달 */}
      <DetailFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={onFilterApply}
        initialValues={filterValues}
      />
    </div>
  );
};

export default NoticeControls;
