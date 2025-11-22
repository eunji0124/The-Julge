/**
 * Dropdown 사용 예제
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
 *     <div className="relative w-60">
 *       <button
 *         className="w-full border px-3 py-2 text-left"
 *         onClick={() => setOpen((prev) => !prev)}
 *       >
 *         {selected ?? '옵션 선택'}
 *       </button>
 *
 *       {open && (
 *         <Dropdown
 *           items={['옵션1', '옵션2', '옵션3']}
 *           selected={selected}
 *           onSelect={handleSelect}
 *           onClose={handleClose}
 *         />
 *       )}
 *     </div>
 *   );
 * };
 */

import { useEffect, useRef, useState, KeyboardEvent } from 'react';

import { cn } from '@/lib/utils';

interface DropdownProps {
  items: string[];
  selected?: string | null;
  onSelect: (value: string) => void;
  onClose: () => void;
  className?: string;
}

const Dropdown = ({
  items,
  selected,
  onSelect,
  onClose,
  className,
}: DropdownProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + items.length) % items.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        onSelect(items[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        'border-gray-20 absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-md border bg-white shadow-lg',
        className
      )}>
      <ul
        role="listbox"
        tabIndex={0}
        className="scrollbar-always max-h-[230px] overflow-y-auto outline-none"
        onKeyDown={handleKeyDown}>
        {items.map((item, index) => {
          const isSelected = selected === item;
          const isHighlighted = highlightedIndex === index;

          return (
            <li
              key={item}
              id={`dropdown-${item.replace(/\s+/g, '-')}`}
              role="option"
              aria-selected={isSelected}
              onClick={() => onSelect(item)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={cn(
                'border-gray-20 cursor-pointer border-b px-3 py-3 text-center',
                'hover:bg-gray-100',
                isHighlighted && 'bg-gray-100',
                isSelected && 'bg-gray-200 font-semibold'
              )}>
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Dropdown;
