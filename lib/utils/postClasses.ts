import { cva } from 'class-variance-authority';

export const postClasses = {
  container: cva(
    'flex flex-col min-w-[171px] min-h-[261px] justify-center gap-5 p-4 max-w-[312px] w-full rounded-[12px] max-h-[348px] border border-[var(--color-gray-20)]'
  ),
  title: cva(
    "font-['Spoqa Han Sans Neo'] text-[16px] font-[700] sm:text-[20px]",
    {
      variants: {
        isActive: {
          true: 'text-[var(--color-black)]',
          false: 'text-[var(--color-gray-30)]',
        },
      },
      defaultVariants: {
        isActive: true,
      },
    }
  ),
  icon: cva('sm:h-5 sm:w-5 h-4 w-4 min-h-4 min-w-4', {
    variants: {
      isActive: {
        true: 'fill-[var(--color-red-30)]',
        false: 'fill-[var(--color-gray-30)]',
      },
    },
    defaultVariants: {
      isActive: true,
    },
  }),
  text: cva("font-['Spoqa Han Sans Neo']font-[400]", {
    variants: {
      isActive: {
        true: 'text-[var(--color-gray-50)]',
        false: 'text-[var(--color-gray-30)]',
      },
      size: {
        sm: 'text-[12px] sm:text-[14px]',
        md: 'text-[14px] sm:text-[16px]',
        lg: 'text-[16px] sm:text-[20px]',
        xl: 'text-[18px] sm:text-[22px]',
      },
    },
    defaultVariants: {
      isActive: true,
      size: 'sm',
    },
  }),
  wage: cva(
    'font-["Spoqa Han Sans Neo"] text-[18px] sm:text-[24px] font-[600] tracking-[0.02em] leading-[1]',
    {
      variants: {
        isActive: {
          true: 'text-[var(--color-black)]',
          false: 'text-[var(--color-gray-30)]',
        },
        size: {
          sm: 'text-[18px] sm:text-[24px]',
          md: 'text-[24px] sm:text-[28px]',
        },
      },
      defaultVariants: {
        isActive: true,
        size: 'sm',
      },
    }
  ),
  badge: cva(
    'ml-2 hidden h-[36px] items-center gap-[6px] rounded-full px-3 text-[14px] font-[600] tracking-[0.05em] text-white sm:flex whitespace-nowrap',
    {
      variants: {
        isActive: {
          true: '',
          false: 'bg-[var(--color-gray-30)]',
        },
      },
      defaultVariants: {
        isActive: true,
      },
    }
  ),
  badgeText: cva(
    'mt-1 flex items-center gap-1 text-[12px] font-[400] tracking-[0.05em] sm:hidden',
    {
      variants: {
        isActive: {
          true: '',
          false: 'fill-[var(--color-gray-30)] text-[var(--color-gray-30)]',
        },
      },
      defaultVariants: {
        isActive: true,
      },
    }
  ),
  badgeArrow: cva('h-[13px] w-[13px] sm:h-[14px] sm:w-[14px]'),
};
