import { useState, useEffect } from 'react';

import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { SeoulDistrict } from '@/constants/locations';
import { cn } from '@/lib/utils';

import LocationFilter from './LocationFilter';
import SelectedLocationBadges from './SelectedLocationBadges';

interface DetailFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  initialValues?: Partial<FilterValues>;
}

export interface FilterValues {
  locations: SeoulDistrict[];
  startDate: string;
  amount: string;
}

const DetailFilterModal = ({
  isOpen,
  onClose,
  onApply,
  initialValues,
}: DetailFilterModalProps) => {
  const [selectedLocations, setSelectedLocations] = useState<SeoulDistrict[]>(
    initialValues?.locations || []
  );
  const [startDate, setStartDate] = useState(initialValues?.startDate || '');
  const [amount, setAmount] = useState(initialValues?.amount || '');

  const handleToggleLocation = (location: SeoulDistrict) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((loc) => loc !== location)
        : [...prev, location]
    );
  };

  const handleRemoveLocation = (location: SeoulDistrict) => {
    setSelectedLocations((prev) => prev.filter((loc) => loc !== location));
  };

  const handleReset = () => {
    setSelectedLocations([]);
    setStartDate('');
    setAmount('');
  };

  const handleApply = () => {
    onApply({
      locations: selectedLocations,
      startDate,
      amount,
    });
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedLocations(initialValues?.locations || []);
      setStartDate(initialValues?.startDate || '');
      setAmount(initialValues?.amount || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* 모바일 대응 */}
      <div
        className="bg-opacity-50 fixed inset-0 z-40 bg-black md:hidden"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          // 모바일
          'fixed inset-0 z-50 bg-white transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full',
          // PC/Tablet
          'md:absolute md:inset-auto md:top-full md:right-0 md:translate-x-0',
          'md:border-gray-20 md:mt-2 md:h-auto md:w-[400px] md:rounded-[10px] md:border md:shadow-lg'
        )}>
        <div className="flex h-full flex-col md:h-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-6">
            <h2 className="text-gray-90 text-lg font-bold">상세 필터</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-60 hover:text-gray-90 transition-colors"
              aria-label="닫기">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6 md:max-h-[70vh]">
            {/* Location Filter */}
            <LocationFilter
              selectedLocations={selectedLocations}
              onToggle={handleToggleLocation}
            />

            {/* Selected Location Badges */}
            <SelectedLocationBadges
              selectedLocations={selectedLocations}
              onRemove={handleRemoveLocation}
            />

            {/* Start Date Input */}
            <div className="space-y-2">
              <label
                htmlFor="startDate"
                className="mb-2 block text-sm font-medium text-gray-700">
                시작일
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-gray-30 focus:border-blue-20 h-[58px] w-full rounded-lg border px-4 py-3 text-base transition-colors outline-none"
              />
            </div>

            {/* Amount Input */}
            <div className="flex items-end">
              <Input
                type="number"
                label="금액"
                value={amount}
                onChange={setAmount}
                unit="원"
                placeholder="금액을 입력하세요"
                className="w-[200px]"
              />
              <p className="pl-3 leading-[58px]">이상부터</p>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="border-gray-20 flex gap-2 border-t px-5 py-4">
            <Button
              variant="secondary"
              size="large"
              onClick={handleReset}
              className="w-auto min-w-20 flex-none">
              초기화
            </Button>
            <Button
              variant="primary"
              size="large"
              onClick={handleApply}
              className="w-auto grow">
              확인
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailFilterModal;
