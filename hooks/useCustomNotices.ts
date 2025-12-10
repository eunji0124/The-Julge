import { useState, useEffect } from 'react';

import { fetchCustomNotices } from '@/lib/noticeService';
import { TransformedNotice } from '@/utils/transformNotice';

export const useCustomNotices = () => {
  const [notices, setNotices] = useState<TransformedNotice[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCustomNotices();
        setNotices(data);
      } catch (error) {
        console.error('맞춤 공고 로딩 실패:', error);
        setNotices([]);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  return { notices, isLoading };
};
