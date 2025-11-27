import { HTMLAttributes } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import BadgeClose from '@/components/icons/BadgeClose';
import { cn } from '@/lib/utils';

/**
 *
 const Ex = () => {

 return (
    <div className="mx-5 my-5 inline-flex gap-4">
      <Badge>대기중</Badge>
      <Badge status="accepted">승인됨</Badge>
      <Badge status="accepted">승인 완료</Badge>
      <Badge status="rejected">거절</Badge>
      <Badge status="canceled">취소</Badge>
      <Badge variant="filter" onRemove={() => console.log('removed')}>
        서울시 강남구
      </Badge>
    </div>
  );
};
 */

type BadgeStatus = 'accepted' | 'rejected' | 'canceled';

// 공통 반응형 스타일
const commonResponsiveStyles =
  'text-xs font-normal leading-4 md:text-sm md:font-bold md:leading-normal lg:text-sm lg:font-bold lg:leading-normal';

const badgeVariants = cva(
  'inline-flex justify-center items-center font-bold rounded-[20px] py-[6px] px-[10px]',
  {
    variants: {
      variant: {
        primary: `text-green-20 bg-green-10 ${commonResponsiveStyles}`,
        secondary: `text-blue-20 bg-blue-10 ${commonResponsiveStyles}`,
        danger: `text-red-50 bg-red-10 ${commonResponsiveStyles}`,
        filter: 'text-red-50 bg-red-10 text-sm font-bold leading-normal gap-1',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

// status를 variant로 매핑
const getVariantFromStatus = (
  statusToMap: BadgeStatus
): 'secondary' | 'danger' => {
  switch (statusToMap) {
    case 'accepted':
      return 'secondary';
    case 'rejected':
    case 'canceled':
      return 'danger';
  }
};

interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  onRemove?: () => void;
  status?: BadgeStatus;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  onRemove,
  className = '',
  status,
  ...props
}) => {
  // status prop이 전달되면 자동으로 variant를 결정하고, 그렇지 않으면 명시적으로 전달된 variant를 사용
  const finalVariant =
    status !== undefined ? getVariantFromStatus(status) : variant;

  return (
    <div
      className={cn(badgeVariants({ variant: finalVariant }), className)}
      {...props}>
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 transition-opacity hover:opacity-70"
          aria-label="Remove badge">
          <BadgeClose className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Badge;
