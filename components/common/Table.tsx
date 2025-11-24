import { useMemo, useState } from 'react';

import Badge, { BadgeStatus } from './Badge';
import Pagination from './Pagination';

/** 사용 예제
 * 
const Ex = () => {
  const columns = [
    { key: 'name', label: '가게' },
    { key: 'workhour', label: '일자' },
    { key: 'hourlyPay', label: '시급' },
    { key: 'status', label: '상태', fixed: 'right' as const },
  ];

  const data = [
    {
      id: '1',
      name: 'HS 과일주스',
      workhour: '2023-01-12 10:00 ~ 12:00 (2시간)',
      hourlyPay: '15,000원',
      status: 'accepted',
    },
    // ... 더 많은 데이터
  ];

  return (
    <div className="flex flex-col items-start">
      <Table columns={columns} data={data} rowKey="id" />
    </div>
  );
};
 */

const LIMIT = 5;

// 인덱스 기반 너비 설정 (0번째, 1번째, 2번째, 3번째 컬럼)
const COLUMN_WIDTH_CLASSES: Record<number, string> = {
  0: 'w-[228px] min-w-[228px]',
  1: 'w-[300px] min-w-[300px]',
  2: 'w-[200px] min-w-[200px]',
  3: 'w-[162px] min-w-[162px] sm:w-[220px] sm:min-w-[220px] lg:w-[236px] lg:min-w-[236px]',
};

interface Column {
  key: string;
  label: string;
  fixed?: 'right';
}

interface TableProps<T extends Record<string, React.ReactNode>> {
  columns: Column[];
  data: T[];
  rowKey?: keyof T;
}

const Table = <T extends Record<string, React.ReactNode>>({
  columns,
  data,
  rowKey = 'id' as keyof T,
}: TableProps<T>) => {
  const [page, setPage] = useState(1);

  // useMemo로 displayData 메모이제이션
  const displayData = useMemo(() => {
    const offset = (page - 1) * LIMIT;
    return data.slice(offset, offset + LIMIT);
  }, [data, page]);

  const { rightFixedColumns, scrollableColumns } = useMemo(
    () => ({
      rightFixedColumns: columns.filter((col) => col.fixed === 'right'),
      scrollableColumns: columns.filter((col) => col.fixed !== 'right'),
    }),
    [columns]
  );

  // 인덱스 기반으로 컬럼 너비 클래스 반환
  const getColumnClassName = (colIndex: number) => {
    return COLUMN_WIDTH_CLASSES[colIndex] || 'w-auto';
  };

  // 헤더 렌더링 함수
  const renderThead = (cols: Column[], startIndex: number = 0) => (
    <thead>
      <tr className="bg-red-10">
        {cols.map((col, idx) => (
          <th
            key={col.key}
            className={`${getColumnClassName(startIndex + idx)} border-gray-20 items-center border-b px-3 py-[14px] text-left text-[12px] leading-[22px] sm:text-[14px]`}>
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
  );

  // 바디 렌더링 함수
  const renderTbody = (cols: Column[], startIndex: number = 0) => (
    <tbody>
      {displayData.map((row, idx) => {
        // rowKey가 있고 해당 값이 존재하면 사용, 아니면 인덱스 사용
        const key = row[rowKey] ? String(row[rowKey]) : idx;
        return (
          <tr key={key} className="border-gray-20 border-b">
            {cols.map((col, colIdx) => (
              <td
                key={col.key}
                className={`${getColumnClassName(startIndex + colIdx)} h-[46px] px-3 text-[14px] leading-[22px] sm:text-[16px] md:h-[69px] lg:h-[69px]`}>
                {/* TODO: 사장님일 때 높이 변경
                    사장님: h-[46px] md:h-[91px] lg:h-[91px]
                    알바님: h-[46px] md:h-[69px] lg:h-[69px] (현재 설정)
                */}
                {col.key === 'status' ? (
                  // TODO : 사장님/알바님에 따른 텍스트 또는 버튼 표시
                  // status="" 일 때, 사장님은 거절하기 & 승인하기 버튼 표시 / 알바님는 "대기중"
                  <Badge status={row[col.key] as BadgeStatus} />
                ) : (
                  row[col.key]
                )}
              </td>
            ))}
          </tr>
        );
      })}
    </tbody>
  );

  // 테이블 렌더링 함수
  const renderTable = (
    cols: Column[],
    startIndex: number = 0,
    className: string = ''
  ) => (
    <table className={`border-collapse ${className}`}>
      {renderThead(cols, startIndex)}
      {renderTbody(cols, startIndex)}
    </table>
  );

  return (
    <div className="@container mx-auto w-full max-w-[964px] font-normal text-black">
      <div className="border-gray-20 overflow-hidden rounded-xl border">
        {/* 부모 요소의 크기가 964px 이상 */}
        <div className="hidden @[964px]:block">
          {renderTable(columns, 0, 'w-full')}
        </div>

        {/* 부모 요소의 크기가 964px 미만 */}
        <div className="relative block @[964px]:hidden">
          <div className="flex overflow-hidden rounded-xl">
            {/* 스크롤 컬럼 */}
            <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [-webkit-scrollbar]:hidden">
              {renderTable(scrollableColumns, 0)}
            </div>

            {/* 고정된 오른쪽 컬럼 */}
            {rightFixedColumns.length > 0 && (
              <div className="border-gray-20 border-l bg-white">
                {renderTable(rightFixedColumns, scrollableColumns.length)}
              </div>
            )}
          </div>
        </div>

        {/* Pagination 컴포넌트 */}
        <div className="w-full pt-3 pr-3 pb-3 pl-[11px] md:px-3 md:py-2 lg:px-3 lg:py-2">
          <Pagination
            total={data.length}
            limit={LIMIT}
            page={page}
            setPage={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Table;
