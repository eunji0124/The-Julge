import { cva } from 'class-variance-authority';

import { SEOUL_DISTRICTS, SeoulDistrict } from '@/constants/locations';
import { cn } from '@/lib/utils';

const locationItemVariants = cva(
  'px-4 py-2 text-sm cursor-pointer transition-colors',
  {
    variants: {
      selected: {
        true: 'text-red-40',
        false: 'bg-white text-black hover:text-red-40',
      },
    },
    defaultVariants: {
      selected: false,
    },
  }
);

interface LocationFilterProps {
  selectedLocations: SeoulDistrict[];
  onToggle: (location: SeoulDistrict) => void;
  className?: string;
}

const LocationFilter = ({
  selectedLocations,
  onToggle,
  className,
}: LocationFilterProps) => {
  return (
    <div className={cn('space-y-2', className)}>
      <h3 className="text-base text-black">위치 선택</h3>
      <div className="border-gray-20 max-h-[258px] overflow-y-auto rounded-md border">
        <div className="grid grid-cols-2 gap-2">
          {SEOUL_DISTRICTS.map((location) => {
            const isSelected = selectedLocations.includes(location);
            return (
              <button
                key={location}
                type="button"
                onClick={() => onToggle(location)}
                className={cn(locationItemVariants({ selected: isSelected }))}>
                {location}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LocationFilter;
