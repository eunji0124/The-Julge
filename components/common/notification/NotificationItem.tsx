import { Notification } from '@/hooks/useNotifications';

interface NotificationItemProps {
  notification: Notification;
  onRead: (notificationId: string) => void;
}

const STATUS_CONFIG = {
  accepted: {
    label: '승인',
    bgColor: 'bg-blue-20',
    textColor: 'text-blue-20',
    borderColor: 'border-blue-20',
  },
  rejected: {
    label: '거절',
    bgColor: 'bg-red-30',
    textColor: 'text-red-30',
    borderColor: 'border-red-30',
  },
};

const NotificationItem = ({ notification, onRead }: NotificationItemProps) => {
  const { label, bgColor, textColor, borderColor } =
    STATUS_CONFIG[notification.status];

  const { id, read, shopName, time } = notification;

  const handleClick = () => {
    if (!read) {
      onRead(id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex max-w-[335px] flex-col items-start gap-1 rounded-[5px] border bg-white px-3 py-4 sm:max-w-[328px] ${read ? 'border-gray-20 cursor-default' : `${borderColor} cursor-pointer hover:opacity-80`}`}>
      {/*  아이콘 */}
      <div className={`h-[5px] w-[5px] rounded-full ${bgColor}`} />

      {/* 메시지 */}
      <div className="text-sm leading-[22px] font-normal">
        {shopName}({time}) 공고 지원이{' '}
        <span className={`${textColor}`}>{`${label}`}</span>되었어요.
      </div>

      {/* 시간 */}
      <div className="text-gray-40 text-xs leading-4 font-normal">{time}</div>
    </div>
  );
};

export default NotificationItem;
