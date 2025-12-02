import { useMemo, useState } from 'react';

import {
  Column,
  EMPLOYEE_COLUMNS,
  EMPLOYER_COLUMNS,
} from '@/constants/tableColumns';
import { useIsEmployer } from '@/hooks/useCheckUserType';

import Badge, { BadgeStatus } from './Badge';
import Pagination from './Pagination';

/**
 * @description
 * 페이지네이션과 반응형 레이아웃을 지원하는 테이블 컴포넌트
 * - 사장님/알바님 모드에 따라 다른 컬럼 표시
 * - 사장님 모드: 신청 대기 상태일 때 승인/거절 버튼 표시
 * - 알바님 모드: 상태 뱃지만 표시
 *
 * @example
 * // 1. 사장님용 테이블
 * const EmployerExample = () => {
 *   // API 응답 데이터
 *   const employerApiData = {
 *     items: [
 *       {
 *         item: {
 *           id: '7c5d86c6-ae25-444c-90c6-8fddbf294bb1',
 *           status: '', // 대기중
 *           user: {
 *             item: {
 *               name: '김강헌',
 *               phone: '010-0000-0000',
 *               bio: '최선을 다해 열심히 일합니다.',
 *             },
 *           },
 *         },
 *       },
 *       // ... 더 많은 items
 *     ],
 *   };
 *
 *   // transformEmployerData 유틸 함수로 변환
 *   const employerData = transformEmployerData(employerApiData.items);
 *   // 결과: [{ id: '7c5d86c6-...', name: '김강헌', bio: '최선을...', phone: '010-0000-0000', status: '' }]
 *
 *   const handleApprove = async (id: string) => {
 *     console.log('승인 API 호출:', id);
 *     // await approveApplication(id);
 *   };
 *
 *   const handleReject = async (id: string) => {
 *     console.log('거절 API 호출:', id);
 *     // await rejectApplication(id);
 *   };
 *
 *   return (
 *     <Table
 *       data={employerData}
 *       rowKey="id"
 *       onApprove={handleApprove}
 *       onReject={handleReject}
 *     />
 *   );
 * };
 *
 * @example
 * // 2. 알바님용 테이블
 * const EmployeeExample = () => {
 *   // API 응답 데이터
 *   const employeeApiData = {
 *     items: [
 *       {
 *         item: {
 *           id: '616a0cf1-6410-43d0-994b-6bb88fb6c6ea',
 *           status: 'accepted',
 *           shop: {
 *             item: {
 *               name: 'HS 과일주스',
 *             },
 *           },
 *           notice: {
 *             item: {
 *               hourlyPay: 15000,
 *               startsAt: '2023-01-12T10:00:00.000Z',
 *               workhour: 2,
 *             },
 *           },
 *         },
 *       },
 *       // ... 더 많은 items
 *     ],
 *   };
 *
 *   // transformEmployeeData 유틸 함수로 변환
 *   const employeeData = transformEmployeeData(employeeApiData.items);
 *   // 결과: [{ id: '616a0cf1-...', shop: 'HS 과일주스', workhour: '2023-01-12 10:00 ~ 12:00 (2시간)', hourlyPay: '15,000원', status: 'accepted' }]
 *
 *   return (
 *     <Table
 *       data={employeeData}
 *       rowKey="id"
 *     />
 *   );
 * };
 */

// 페이지네이션: 한 페이지당 표시할 데이터 개수 (5개)
const LIMIT: number = 5;

// 인덱스 기반 너비 설정 (0번째, 1번째, 2번째, 3번째 컬럼)
const COLUMN_WIDTH_CLASSES: Record<number, string> = {
  0: 'w-[228px] min-w-[228px]',
  1: 'w-[300px] min-w-[300px]',
  2: 'w-[200px] min-w-[200px]',
  3: 'w-[162px] min-w-[162px] sm:w-[220px] sm:min-w-[220px] lg:w-[236px] lg:min-w-[236px]',
};

// 사장님 전용 : 신청 대기 상태일 때 표시되는 승인/거절 버튼의 기본 스타일
const STATUS_BTN_CLASSNAME: string =
  'py-2 px-3 justify-center items-center rounded-md border text-xs font-normal leading-4 text-center sm:py-2.5 sm:px-5 sm:text-sm sm:font-bold sm:leading-normal';

interface TableProps<T extends Record<string, React.ReactNode>> {
  data: T[];
  rowKey?: keyof T;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const Table = <T extends Record<string, React.ReactNode>>({
  data,
  rowKey = 'id' as keyof T,
  onApprove,
  onReject,
}: TableProps<T>): React.JSX.Element => {
  const isEmployer = useIsEmployer();
  const columns = isEmployer ? EMPLOYER_COLUMNS : EMPLOYEE_COLUMNS;
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

  const renderStatusCell = (row: T, rowId: string) => {
    // 사장님이고 status가 ''(대기중)일 때 버튼 표시
    if (isEmployer && row.status === '') {
      return (
        <div className="flex items-center justify-between py-[7px]">
          <button
            onClick={() => onReject?.(rowId)}
            className={`${STATUS_BTN_CLASSNAME} border-red-50 text-red-50 hover:bg-red-50 hover:text-white`}>
            거절하기
          </button>
          <button
            onClick={() => onApprove?.(rowId)}
            className={`${STATUS_BTN_CLASSNAME} border-blue-20 text-blue-20 hover:bg-blue-20 hover:text-white`}>
            승인하기
          </button>
        </div>
      );
    }
    return <Badge status={row.status as BadgeStatus} />;
  };

  // 헤더 렌더링 함수
  const renderThead = (cols: readonly Column[], startIndex: number = 0) => (
    <thead>
      <tr className="bg-red-10">
        {cols.map((col, idx) => (
          <th
            key={col.key}
            className={`${getColumnClassName(startIndex + idx)} border-gray-20 items-center border-b px-3 py-3.5 text-left text-[12px] leading-[22px] sm:text-[14px]`}>
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
  );

  // 바디 렌더링 함수
  const renderTbody = (cols: readonly Column[], startIndex: number = 0) => {
    return (
      <tbody>
        {displayData.map((row) => {
          // rowKey가 있고 해당 값이 존재하면 사용, 아니면 인덱스 사용
          const key = String(row[rowKey]);
          const rowId = String(row[rowKey]);

          return (
            <tr key={key} className="border-gray-20 border-b">
              {cols.map((col, colIdx) => (
                <td
                  key={col.key}
                  className={`${getColumnClassName(startIndex + colIdx)} h-[46px] px-2 text-[14px] leading-[22px] sm:px-3 sm:text-[16px] ${
                    isEmployer ? 'sm:h-[91px]' : 'sm:h-[69px]'
                  }`}>
                  {col.key === 'status'
                    ? renderStatusCell(row, rowId)
                    : row[col.key]}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    );
  };

  // 테이블 렌더링 함수
  const renderTable = (
    cols: readonly Column[],
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
      <div className="border-gray-20 overflow-hidden rounded-xl border bg-white">
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
