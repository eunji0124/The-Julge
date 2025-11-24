

interface NotificationItemProps {
  message: string;
  status: string;
  time: string;
}

export default function NotificationItem({
  message,
  status,
  time,
}: NotificationItemProps) {
  return (
    <div className="p-3 bg-white rounded-lg shadow-sm border">
      <div className="flex items-start gap-2">
        {/* 빨간/파란 점 */}
        <span
          className={`w-2 h-2 rounded-full mt-[6px] ${
            status === "승인" ? "bg-blue-500" : "bg-red-500"
          }`}
        ></span>

        {/* 메시지 */}
        <div className="flex flex-col">
          <p className="text-sm">
            {/** 승인 → 파란색, 거절 → 빨간색 */}
            {message.split("승인").length > 1 ? (
              <>
                {message.split("승인")[0]}
                <span className="text-blue-600 font-medium">승인</span>
                {message.split("승인")[1]}
              </>
            ) : message.split("거절").length > 1 ? (
              <>
                {message.split("거절")[0]}
                <span className="text-red-600 font-medium">거절</span>
                {message.split("거절")[1]}
              </>
            ) : (
              message
            )}
          </p>

          {/* 시간 */}
          <span className="text-xs text-gray-500 mt-1">{time}</span>
        </div>
      </div>
    </div>
  );
}
