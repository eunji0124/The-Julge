/** 사용 예제
 * 
const data = Array.from({ length: 47 }, (_, i) => `아이템 ${i + 1}`);
const Ex = () => {
  const [page, setPage] = useState(1);  
  const limit = 5; 
  const offset = (page - 1) * limit;
  const currentItems = data.slice(offset, offset + limit);

  return (
    <>
      <div>
        <ul>
          {currentItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <Pagination
          total={data.length}   // 전체 데이터 개수
          limit={limit}    // 한 페이지에 보여줄 데이터 개수
          page={page}  // 현재 사용자가 보고 있는 페이지 번호
          setPage={setPage} // 현재 페이지 번호를 변경하는 함수(setState)
        />
      </div>
    </>
  );
};
 */

interface PaginationProps {
  total: number;
  limit: number;
  page: number;
  setPage: (page: number) => void;
}

const Pagination = ({ total, limit, page, setPage }: PaginationProps) => {
  const numPages = Math.ceil(total / limit);

  if (numPages <= 1) return null;

  // 최대 7개의 페이지 번호만 표시
  const MAX_VISIBLE_PAGES = 7;

  const getPageNumbers = () => {
    // 전체 페이지가 7개 이하면 모두 표시
    if (numPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: numPages }, (_, i) => i + 1);
    }

    // 현재 페이지를 중심으로 표시할 페이지 계산
    const halfVisible = Math.floor(MAX_VISIBLE_PAGES / 2); // 3
    let startPage = Math.max(1, page - halfVisible);
    const endPage = Math.min(numPages, startPage + MAX_VISIBLE_PAGES - 1);

    // 끝에 가까우면 시작 페이지 조정
    if (endPage - startPage < MAX_VISIBLE_PAGES - 1) {
      startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-1 sm:gap-2">
      {/* Prev */}
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className={`flex h-[32px] w-[32px] items-center justify-center rounded sm:h-[40px] sm:w-[40px] ${
          page === 1 ? 'cursor-default opacity-40' : 'hover:bg-gray-100'
        }`}
        aria-label="이전 페이지">
        &lt;
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((pageNum) => {
        const isActive = page === pageNum;
        return (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            aria-current={isActive ? 'page' : undefined}
            className={`flex h-[32px] w-[32px] items-center justify-center rounded sm:h-[40px] sm:w-[40px] ${
              isActive
                ? 'border-red-30 bg-red-30 text-white'
                : 'hover:bg-gray-10'
            }`}>
            {pageNum}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={() => setPage(page + 1)}
        disabled={page === numPages}
        className={`flex h-[32px] w-[32px] items-center justify-center rounded sm:h-[40px] sm:w-[40px] ${
          page === numPages ? 'cursor-default opacity-40' : 'hover:bg-gray-100'
        }`}
        aria-label="다음 페이지">
        &gt;
      </button>
    </nav>
  );
};

export default Pagination;
