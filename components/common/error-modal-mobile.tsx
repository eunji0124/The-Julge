{/* <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-100">
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
    </div> */}
interface ErrorModalMobileProps {
  message: string;
  onClose: () => void;
}

export default function ErrorModalMobile({ message, onClose }: ErrorModalMobileProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[327px] h-[220px] bg-white rounded-xl p-6 relative shadow-lg">
        
        <p className="text-center text-gray-700 mt-14">
          {message}
        </p>

        <button
          onClick={onClose}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 border border-orange-500 text-orange-500 rounded-md"
        >
          확인
        </button>
      </div>
    </div>
  );
}
