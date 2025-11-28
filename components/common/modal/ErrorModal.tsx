/**
 * ErrorModal 사용 예제
 *
 * import { useState } from 'react';
 * import ErrorModal from './ErrorModal';
 *
 * const ParentComponent = () => {
 *   const [errorOpen, setErrorOpen] = useState(false);
 *
 *   return (
 *     <div className="p-10">
 *       <button
 *         onClick={() => setErrorOpen(true)}
 *         className="border p-2 bg-blue-200"
 *       >
 *         Error Modal 열기
 *       </button>
 *
 *       {errorOpen && (
 *         <ErrorModal
 *           message="이미 사용중인 이메일입니다"
 *           onClose={() => setErrorOpen(false)}
 *         />
 *       )}
 *     </div>
 *     </div>
 *   );
 * };
 */

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

const ErrorModal = ({ message, onClose }: ErrorModalProps) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
      <div className="flex h-[220px] w-[327px] flex-col items-center gap-[50px] rounded-lg bg-white pt-[81px] pb-7 sm:h-[250px] sm:w-[540px] sm:gap-[45px] sm:pt-27">
        {/* 메시지 */}
        <p className="text-gray-60 text-base font-medium sm:text-lg">
          {message}
        </p>

        {/* 버튼 */}
        <button
          onClick={onClose}
          className="w-fit cursor-pointer rounded-lg bg-red-50 px-[56px] py-3 text-center text-sm font-medium text-white hover:bg-white hover:text-red-50 sm:mr-7 sm:ml-auto sm:px-[46px] sm:py-[14px] sm:text-base">
          확인
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
