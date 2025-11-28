/**
 * 시급을 한국 통화(원) 형식으로 포맷팅합니다.
 *
 * @param pay - 포맷팅할 시급 (숫자 또는 문자열)
 * @returns 천 단위 구분 기호가 포함된 "금액원" 형식의 문자열
 *
 * @example
 * ```typescript
 * formatPay(15000);      // "15,000원"
 * formatPay("15000");    // "15,000원"
 * formatPay(1000000);    // "1,000,000원"
 * ```
 */
export const formatPay = (pay: number | string): string => {
  return `${Number(pay).toLocaleString()}원`;
};
