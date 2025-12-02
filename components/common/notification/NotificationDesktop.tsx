"use client";

import NotificationItem from "./NotificationItem";

export default function NotificationDesktop({ onClose }: { onClose: () => void }) {
  const alerts = [
    {
      id: 1,
      message: "HS 과일주스(2023-01-14 15:00~18:00) 공고 지원이 승인되었어요.",
      status: "승인",
      time: "1분 전",
    },
    {
      id: 2,
      message: "써니 브런치 레스토랑(2023-01-14 15:00~18:00) 공고 지원이 승인되었어요.",
      status: "승인",
      time: "3분 전",
    },
    {
      id: 3,
      message: "수리 에스프레소 샵(2023-01-14 15:00~18:00) 공고 지원이 거절되었어요.",
      status: "거절",
      time: "7분 전",
    },
  ];

  return (
    <div className="w-[368px]  bg-[#FFECE7] rounded-xl p-4 flex flex-col">
      <h2 className="font-semibold text-lg mb-3">알림 {alerts.length}개</h2>

      
      <div className="flex flex-col gap-4">
        {alerts.map((alert) => (
          <NotificationItem
            key={alert.id}
            message={alert.message}
            status={alert.status as "승인" | "거절"}
            time={alert.time}
          />
        ))}
      </div>
    </div>
  );
}
