// 사용예제
// import { useState } from "react";
// import NotificationModal from "@/components/common/notification/notificationmodal";

// export default function Home() {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-100">
//       <button
//         onClick={() => setOpen(true)}
//         className="px-4 py-2 bg-white border shadow rounded"
//       >
//         알림 모달 열기
//       </button>

//       {open && <NotificationModal isOpen={open} onClose={() => setOpen(false)} />}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import NotificationDesktop from "./NotificationDesktop";
import NotificationMobile from "./NotificationMobile";

export default function NotificationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 480);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {isMobile ? (
          <NotificationMobile onClose={onClose} />
        ) : (
          <NotificationDesktop onClose={onClose} />
        )}
      </div>
    </div>
  );
}
