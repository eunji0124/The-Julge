export const ITEMS_PER_PAGE = 6;

export const SORT_OPTIONS = [
  '마감임박순',
  '시급많은순',
  '시간적은순',
  '가나다순',
] as const;

export type SortType = (typeof SORT_OPTIONS)[number];
