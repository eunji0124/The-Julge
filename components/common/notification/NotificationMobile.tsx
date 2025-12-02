"use client";

import NotificationItem from "./NotificationItem";

export default function NotificationMobile({
  onClose,
}: {
  onClose: () => void;
}) {
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
    <div
      className="
        w-[375px]
        h-[100vh]
        bg-[#FFE1DA]
        rounded-none
        p-5
        flex
        flex-col
      "
    >
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">
          알림 {alerts.length}개
        </h2>
        <button onClick={onClose} className="text-xl">✕</button>
      </div>

      
      <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1">
        {alerts.map((alert) => (
          <NotificationItem
            key={alert.id}
            message={alert.message}
            status={alert.status}
            time={alert.time}
          />
        ))}
      </div>
    </div>
  );
}
