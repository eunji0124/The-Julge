import Badge from '@/components/common/Badge';
import { SeoulDistrict } from '@/constants/locations';
import { cn } from '@/lib/utils';

interface SelectedLocationBadgesProps {
  selectedLocations: SeoulDistrict[];
  onRemove: (location: SeoulDistrict) => void;
  className?: string;
}

const SelectedLocationBadges = ({
  selectedLocations,
  onRemove,
  className,
}: SelectedLocationBadgesProps) => {
  if (selectedLocations.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {selectedLocations.map((location) => (
        <Badge
          key={location}
          variant="filter"
          onRemove={() => onRemove(location)}>
          {location}
        </Badge>
      ))}
    </div>
  );
};

export default SelectedLocationBadges;
