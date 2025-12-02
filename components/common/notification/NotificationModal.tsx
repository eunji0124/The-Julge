import { useEffect } from 'react';

import Image from 'next/image';

import NotificationItem from '@/components/common/notification/NotificationItem';
import { Notification } from '@/hooks/useNotifications';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Array<Notification>;
  onReadNotification: (notificationId: string) => void;
}

const NotificationModal = ({
  isOpen,
  onClose,
  notifications,
  onReadNotification,
}: NotificationModalProps) => {
  // 스크롤 방지
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // ESC키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="bg-red-10 sm:border-gray-30 fixed inset-0 z-1 flex flex-col gap-4 overflow-hidden px-5 py-10 sm:absolute sm:inset-auto sm:top-14 sm:right-0 sm:max-h-[60vh] sm:w-[368px] sm:gap-4 sm:rounded-[10px] sm:border sm:px-5 sm:py-6">
      {/* 제목 및 닫기 버튼 */}
      <div className="flex w-full items-center justify-between">
        <h2 className="text-xl leading-normal font-bold">
          알림 {notifications.length > 0 && ` ${notifications.length}개`}
        </h2>
        <button onClick={onClose} className="flex h-6 w-6 sm:hidden">
          <Image
            src="/images/close.svg"
            width={14}
            height={14}
            alt="알림 닫기"
          />
        </button>
      </div>
      {/* 알림 영역 */}

      {notifications.length === 0 ? (
        <div className="text-gray-40 w-full text-lg">알림이 없습니다</div>
      ) : (
        <div className="flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col items-center justify-center gap-2">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={onReadNotification}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationModal;
