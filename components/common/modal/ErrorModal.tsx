{
  /* <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-100">
      <button onClick={() => setDesk(true)} className="px-4 py-2 bg-white shadow border">
        데스크탑 모달 열기
      </button>

      

      <button onClick={() => setMob(true)} className="px-4 py-2 bg-white shadow border">
        모바일 모달 열기
      </button>

      {desk && (
        <ErrorModalDesktop
          message="비밀번호가 일치하지 않습니다."
          onClose={() => setDesk(false)}
        />
      )}

      

      {mob && (
        <ErrorModalMobile
          message="비밀번호가 일치하지 않습니다."
          onClose={() => setMob(false)}
        />
      )}
    </div> */
}

interface ErrorModalDesktopProps {
  message: string;
  onClose: () => void;
}

const ErrorModal = ({ message, onClose }: ErrorModalDesktopProps) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
      <div className="flex h-[220px] w-[327px] flex-col items-center gap-[50px] rounded-lg bg-white pt-[81px] pb-7 sm:h-[250px] sm:w-[540px] sm:gap-[45px] sm:pt-7 sm:pt-27">
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
