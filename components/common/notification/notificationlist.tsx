import NotificationItem from "./notificationitem";

export default function NotificationList() {
  const alerts = [
    {
      message: "HS 과일주스 공고 지원이 승인되었어요.",
      status: "승인",
      time: "1분 전",
    },
    {
      message: "써니 브런치 레스토랑 공고 지원이 승인되었어요.",
      status: "승인",
      time: "3분 전",
    },
    {
      message: "수리 에스프레소 샵 공고 지원이 거절되었어요.",
      status: "거절",
      time: "7분 전",
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {alerts.map((alert, i) => (
        <NotificationItem
          key={i}
          message={alert.message}
          status={alert.status}
          time={alert.time}
        />
      ))}
    </div>
  );
}
