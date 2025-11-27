/**
 * AlertModal 사용 예제
 *
 * import { useState } from 'react';
 * import AlertModal from './AlertModal';
 *
 * const ParentComponent = () => {
 *   const [alertOpen, setAlertOpen] = useState(false);
 *
 *   return (
 *     <div className="p-10">
 *       <button
 *         onClick={() => setAlertOpen(true)}
 *         className="border p-2"
 *       >
 *         Alert Modal 열기
 *       </button>
 *
 *       <AlertModal
 *         isOpen={alertOpen}
 *         message="가게 정보를 먼저 등록해 주세요."
 *         onClose={() => setAlertOpen(false)}
 *       />
 *     </div>
 *   );
 * };
 */

import Image from 'next/image';

import BaseModal from './basemodal';

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const AlertModal = ({ isOpen, message, onClose }: AlertModalProps) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="flex h-[183px] w-[298px] flex-col items-center justify-center gap-5 p-4">
        {/* 아이콘 */}
        <Image
          src="/images/check.png"
          alt="느낌표 아이콘"
          width={24}
          height={24}
        />

        {/* 메시지 */}
        <p className="text-[16px]">{message}</p>

        {/* 버튼 */}
        <button
          onClick={onClose}
          className="h-[37px] w-[80px] rounded-md border border-[#EA3C12] text-[15px] text-[#EA3C12] transition hover:bg-[#fde9e6]">
          확인
        </button>
      </div>
    </BaseModal>
  );
};

export default AlertModal;
