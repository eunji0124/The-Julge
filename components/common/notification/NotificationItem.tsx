interface NotificationItemProps {
  message: string;
  status: string;
  time: string;
}

const STATUS_CONFIG = {
  accepted: {
    label: '승인',
    bgColor: 'bg-blue-20',
    textColor: 'text-blue-20',
  },
  rejected: {
    label: '거절',
    bgColor: 'bg-red-30',
    textColor: 'text-red-30',
  },
};

const NotificationItem = ({ message, status, time }: NotificationItemProps) => {
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];

  return (
    <div className="sm:max-w-[328px ] border-gray-20 items -start flex max-w-[335px] flex-col gap-1 rounded-[5px] border bg-white px-3 py-4">
      {/*  아이콘 */}
      <div className={`h-[5px] w-[5px] rounded-full ${config.bgColor}`} />

      {/* 메시지 */}
      <div className="text-sm leading-[22px] font-normal">{message}</div>

      {/* 시간 */}
      <div className="text-gray-40 text-xs leading-4 font-normal">{time}</div>
    </div>
  );
};

export default NotificationItem;
