import { useMemo } from 'react';

export const useSearchTerm = (rawSearch: string | string[] | undefined) => {
  return useMemo(() => {
    if (!rawSearch) return '';
    if (Array.isArray(rawSearch)) return rawSearch[0] ?? '';
    return rawSearch;
  }, [rawSearch]);
};
