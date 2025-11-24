

import { useEffect, useState } from "react";
import NotificationDesktop from "./notificationdesktop";
import NotificationMobile from "./notificationmobile";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationModal({
  isOpen,
  onClose,
}: ModalProps) {
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
