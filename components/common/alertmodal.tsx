import BaseModal from "./basemodal";
import Image from "next/image";

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function AlertModal({
  isOpen,
  message,
  onClose,
}: AlertModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="w-[298px] h-[183px] p-4 flex flex-col items-center justify-center gap-5">

        {/* 아이콘 */}
        <Image src="/images/check.png" alt="느낌표 아이콘" width={24} height={24} />

        {/* 메시지 */}
        <p className="text-[16px]">{message}</p>

        {/* 버튼 */}
        <button
          onClick={onClose}
          className="
            w-[80px] h-[37px]
            border border-[#EA3C12] text-[#EA3C12]
            rounded-md text-[15px]
            hover:bg-[#fde9e6] transition
          "
        >
          확인
        </button>
      </div>
    </BaseModal>
  );
}
