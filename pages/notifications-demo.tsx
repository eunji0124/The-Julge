import NotificationModal from "@/components/common/notification/notificationmodal";
import { useState } from "react";

export default function NotificationsDemo() {
  const [open, setOpen] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  return (
    <div className="p-10">
      <button
        className="border p-3"
        onClick={() => {
          if (!token || !userId) {
            alert("로그인 먼저 해주세요!");
            return;
          }
          setOpen(true);
        }}
      >
        알림 모달 열기
      </button>

      {token && userId && (
        <NotificationModal
          isOpen={open}
          onClose={() => setOpen(false)}
          userId={userId}
          token={token}
        />
      )}
    </div>
  );
}
