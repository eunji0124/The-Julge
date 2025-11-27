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

interface ErrorModalDesktopProps {
  message: string;
  onClose: () => void;
}

export default function ErrorModalDesktop({
  message,
  onClose,
}: ErrorModalDesktopProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-lg shadow-lg w-[540px] h-[250px] p-6 flex flex-col justify-between">
        {/* 메시지 */}
        <p className="text-center text-gray-800 mt-16">{message}</p>

        {/* 버튼: 오른쪽 아래 */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
