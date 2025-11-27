import BaseModal from "./basemodal";
import Image from "next/image";

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onCancel}>
      <div className="w-[298px] h-[183px] p-4 flex flex-col items-center justify-center gap-5">

        {/* 아이콘 */}
        <Image src="/images/check.png" alt="느낌표 아이콘" width={24} height={24} />

        {/* 메시지 */}
        <p className="text-[16px]">{message}</p>

        {/* 버튼 그룹 */}
        <div className="flex gap-3">

          <button
            onClick={onCancel}
            className="
              w-[108px] h-[37px]
              border border-[#EA3C12] text-[#EA3C12]
              rounded-md text-[15px]
              hover:bg-[#fde9e6]
            "
          >
            아니요
          </button>

          <button
            onClick={onConfirm}
            className="
              w-[108px] h-[37px]
              bg-[#EA3C12] text-white rounded-md text-[15px]
              hover:bg-[#d63a2d]
            "
          >
            예
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
