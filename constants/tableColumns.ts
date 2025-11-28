/**
 * 테이블 컬럼 정의
 *
 * 사용자 타입(사장님/알바님)에 따라 표시되는 테이블 컬럼을 정의합니다.
 */

export interface Column {
  key: string;
  label: string;
  fixed?: 'right';
}

/**
 * 사장님용 테이블 컬럼 설정
 *
 * 공고에 지원한 알바생들의 신청 목록을 표시합니다.
 * - name: 신청자 이름
 * - bio: 신청자 소개
 * - phone: 연락처
 * - status: 승인/거절 상태 (오른쪽 고정)
 */
export const EMPLOYER_COLUMNS: readonly Column[] = [
  { key: 'name', label: '신청자' },
  { key: 'bio', label: '소개' },
  { key: 'phone', label: '전화번호' },
  { key: 'status', label: '상태', fixed: 'right' },
];

/**
 * 알바님용 테이블 컬럼 설정
 *
 * 알바생이 지원한 공고들의 신청 내역을 표시합니다.
 * - shop: 가게 이름
 * - workhour: 근무 일자 및 시간
 * - hourlyPay: 시급
 * - status: 승인/거절 상태 (오른쪽 고정)
 */
export const EMPLOYEE_COLUMNS: readonly Column[] = [
  { key: 'shop', label: '가게' },
  { key: 'workhour', label: '일자' },
  { key: 'hourlyPay', label: '시급' },
  { key: 'status', label: '상태', fixed: 'right' },
];
