import { useEffect, useState } from 'react';

const RECENT_NOTICES_KEY = 'recent-notices';
const MAX_RECENT_NOTICES = 6;

interface RecentNotice {
  id: string;
  shopId: string;
  timestamp: number;
}

// 최근 본 공고를 로컬 스토리지에서 가져오기
const getRecentNotices = (): RecentNotice[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(RECENT_NOTICES_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('최근 본 공고 로딩 실패:', error);
    return [];
  }
};

// 최근 본 공고를 로컬 스토리지에 저장
const saveRecentNotices = (notices: RecentNotice[]) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(RECENT_NOTICES_KEY, JSON.stringify(notices));
  } catch (error) {
    console.error('최근 본 공고 저장 실패:', error);
  }
};

// 최근 본 공고에 추가
export const addRecentNotice = (shopId: string, noticeId: string) => {
  const recent = getRecentNotices();

  // 중복 제거 (이미 본 공고는 제거)
  const filtered = recent.filter((item) => item.id !== noticeId);

  // 새 항목을 맨 앞에 추가
  const updated = [
    { id: noticeId, shopId, timestamp: Date.now() },
    ...filtered,
  ].slice(0, MAX_RECENT_NOTICES); // 최대 6개까지만 유지 (가장 오래된 것 자동 삭제)

  saveRecentNotices(updated);
};

// 최근 본 공고 훅
export const useRecentNotices = () => {
  const [recentNotices, setRecentNotices] = useState<RecentNotice[]>([]);

  useEffect(() => {
    setRecentNotices(getRecentNotices());

    // 로컬 스토리지 변경 감지 (다른 탭에서 변경 시)
    const handleStorageChange = () => {
      setRecentNotices(getRecentNotices());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return recentNotices;
};

// 최근 본 공고 초기화 (필요시 사용)
export const clearRecentNotices = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(RECENT_NOTICES_KEY);
};
