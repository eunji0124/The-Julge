/**
 * 사용 예제
 *
 * import { useState, useCallback } from 'react';
 * import Dropdown from './Dropdown';
 *
 * const ParentComponent = () => {
 *   const [open, setOpen] = useState(false);
 *   const [selected, setSelected] = useState<string | null>(null);
 *
 *   const handleClose = useCallback(() => {
 *     setOpen(false);
 *   }, []);
 *
 *   const handleSelect = (value: string) => {
 *     setSelected(value);
 *     setOpen(false);
 *   };
 *
 *   return (
 *     <div className="relative">
 *       <button onClick={() => setOpen((prev) => !prev)}>
 *         {selected ?? '메뉴 선택'}
 *       </button>
 *
 *       {open && (
 *         <Dropdown
 *           items={['React', 'Vue', 'Svelte']}
 *           onSelect={handleSelect}
 *           onClose={handleClose}
 *         />
 *       )}
 *     </div>
 *   );
 * };
 *
 */

import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

interface DropdownProps {
  items: string[];
  onSelect: (value: string) => void;
  onClose: () => void;
  className?: string;
}

const Dropdown = ({ items, onSelect, onClose, className }: DropdownProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={cn(
        'border-gray-20 absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-md border bg-white shadow-lg',
        className
      )}>
      <ul className="scrollbar-always max-h-[230px] overflow-y-auto">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            id={`dropdown-item-${index}`}
            role="option"
            aria-selected={false}
            onClick={() => onSelect(item)}
            className="border-gray-20 cursor-pointer border-b px-3 py-3 text-center hover:bg-gray-100">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
