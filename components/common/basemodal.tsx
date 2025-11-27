// 사용 예제

// export default function Home() {
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [alertOpen, setAlertOpen] = useState(false);

//   return (
//     <div className="p-10">

//       {/* Confirm Modal 버튼 */}
//       <button
//         onClick={() => setConfirmOpen(true)}
//         className="border p-2 bg-blue-200"
//       >
//         Confirm Modal 열기
//       </button>

//       <ConfirmModal
//         isOpen={confirmOpen}
//         message="신청을 거절하시겠어요?"
//         onConfirm={() => {
//           alert("확인 클릭됨");
//           setConfirmOpen(false);
//         }}
//         onCancel={() => setConfirmOpen(false)}
//       />

//       {/* Alert Modal 버튼 */}
//       <button
//         className="border p-2 mt-4"
//         onClick={() => setAlertOpen(true)}
//       >
//         Alert Modal 열기
//       </button>

//       <AlertModal
//         isOpen={alertOpen}
//         message="가게 정보를 먼저 등록해 주세요."
//         onClose={() => setAlertOpen(false)}
//       />
//     </div>
//   );
// }
// 

import { ReactNode, useEffect } from "react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function BaseModal({ isOpen, onClose, children }: BaseModalProps) {
  // 스크롤 방지
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // ESC키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-xl shadow-md flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
