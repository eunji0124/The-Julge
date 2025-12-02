"use client";

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
    <div className="px-4 pt-2 pb-4 bg-white rounded-lg border shadow-sm flex flex-col gap-2">
      {/*  아이콘 */}
      <div className="mt-0.1">
        <span
          className={`inline-block w-[6px] h-[6px] rounded-full ${
            status === "승인" ? "bg-[#0080FF]" : "bg-[#FF3B30]"
          }`}
        ></span>
      </div>

      {/* 메시지 */}
      <p className="text-sm leading-5">
        {message.includes("승인") ? (
          <>
            {message.split("승인")[0]}
            <span className="text-[#0080FF] font-medium">승인</span>
            {message.split("승인")[1]}
          </>
        ) : message.includes("거절") ? (
          <>
            {message.split("거절")[0]}
            <span className="text-[#FF3B30] font-medium">거절</span>
            {message.split("거절")[1]}
          </>
        ) : (
          message
        )}
      </p>

      {/* 시간 */}
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  );
}
