/**
 * ConfirmModal 사용 예제
 *
 * import { useState } from 'react';
 * import ConfirmModal from './ConfirmModal';
 *
 * const ParentComponent = () => {
 *   const [confirmOpen, setConfirmOpen] = useState(false);
 *
 *   return (
 *     <div className="p-10">
 *       <button
 *         onClick={() => setConfirmOpen(true)}
 *         className="border p-2 bg-blue-200"
 *       >
 *         Confirm Modal 열기
 *       </button>
 *
 *       <ConfirmModal
 *         isOpen={confirmOpen}
 *         message="신청을 거절하시겠어요?"
 *         onConfirm={() => {
 *           alert("확인 클릭됨");
 *           setConfirmOpen(false);
 *         }}
 *         onCancel={() => setConfirmOpen(false)}
 *       />
 *     </div>
 *   );
 * };
 */

import Image from 'next/image';

import BaseModal from './BaseModal';

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onCancel}>
      <div className="flex h-[183px] w-[298px] flex-col items-center justify-center gap-5 p-4">
        {/* 아이콘 */}
        <Image
          src="/images/check.png"
          alt="느낌표 아이콘"
          width={24}
          height={24}
        />

        {/* 메시지 */}
        <p className="text-[16px] whitespace-pre-line">
          {message.replace(/<br\s*\/?>/gi, '\n')}
        </p>

        {/* 버튼 그룹 */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="h-[37px] w-[108px] rounded-md border border-[#EA3C12] text-[15px] text-[#EA3C12] hover:bg-[#fde9e6]">
            아니요
          </button>

          <button
            onClick={onConfirm}
            className="h-[37px] w-[108px] rounded-md bg-[#EA3C12] text-[15px] text-white hover:bg-[#d63a2d]">
            예
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ConfirmModal;
