import { UserType } from '@/api/types';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * 사용자 타입 확인 훅 모음
 *
 * 로그인한 사용자가 사장님인지 알바생인지 확인하는 훅들을 제공합니다.
 * Zustand selector를 사용하여 필요한 상태만 구독하므로 성능이 최적화되어 있습니다.
 *
 * @example
 * ```typescript
 * // 사장님 여부 확인
 * const isEmployer = useIsEmployer();
 * if (isEmployer) {
 *   return <EmployerDashboard />;
 * }
 *
 * // 알바생 여부 확인
 * const isEmployee = useIsEmployee();
 * if (isEmployee) {
 *   return <EmployeeDashboard />;
 * }
 * ```
 */

/**
 * 사장님 여부를 확인하는 훅
 * @returns {boolean} 사장님이면 true, 아니면 false
 */
export const useIsEmployer = () =>
  useAuthStore((state) => state.user?.type === UserType.EMPLOYER);

/**
 * 알바생 여부를 확인하는 훅
 * @returns {boolean} 알바생이면 true, 아니면 false
 */
export const useIsEmployee = () =>
  useAuthStore((state) => state.user?.type === UserType.EMPLOYEE);
