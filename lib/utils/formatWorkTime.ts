/**
 * workTime RFC3339 문자열 + duration(시간) 받아서
 * "YYYY-MM-DD HH:mm~HH:mm (n시간)" 형식으로 변환
 */
export function formatWorkTime(startAt: string, durationHours: number) {
  const startDate = new Date(startAt);
  const now = new Date();

  // 종료 시간 계산
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + durationHours);

  // 날짜 포맷
  const pad = (n: number) => n.toString().padStart(2, '0');
  const dateStr = `${startDate.getFullYear()}-${pad(startDate.getMonth() + 1)}-${pad(startDate.getDate())}`;
  const startTimeStr = `${pad(startDate.getHours())}:${pad(startDate.getMinutes())}`;
  const endTimeStr = `${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`;

  const text = `${dateStr} ${startTimeStr}~${endTimeStr} (${durationHours}시간)`;

  return {
    text,
    isExpired: startDate < now,
  };
}
