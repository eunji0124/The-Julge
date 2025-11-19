import type { ButtonHTMLAttributes } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// cva 정의
const buttonVariants = cva(
  'shrink-0 transition-colors font-bold text-center rounded-md w-full',
  {
    variants: {
      variant: {
        primary:
          'bg-red-50 border border-red-50 text-white hover:bg-white hover:text-red-50 cursor-pointer',
        secondary:
          'bg-white border border-red-50 text-red-50 hover:bg-red-50 hover:text-white cursor-pointer',
      },
      size: {
        large: 'max-w-[350px] h-[48px] text-base',
        medium: 'max-w-[108px] h-[37px] text-sm',
        small: 'max-w-[82px] h-[32px] font-normal text-xs',
      },
      disabled: {
        true: '!bg-gray-40 !border-gray-40 !text-white !cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
      disabled: false,
    },
  }
);

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>,
    VariantProps<typeof buttonVariants> {}

const Button = ({
  children,
  className,
  variant,
  size,
  disabled = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      disabled={!!disabled}
      className={cn(buttonVariants({ variant, size, disabled }), className)}
      {...props}>
      {children}
    </button>
  );
};

export default Button;
