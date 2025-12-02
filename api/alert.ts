import { api } from './client';
import {
  GetApplicationsQuery,
  AlertsResponse,
  ReadAlertResponse,
} from './types';

/**
 * 알림(alert) API
 *
 * 알림 관련 API 엔드포인트를 관리
 */
const alert = {
  /**
   * 알림 목록 조회
   * @param userId - 사용자 ID
   * @param query - 쿼리 파라미터 (offset, limit)
   * @returns 알림 목록
   */
  getAlerts: async (userId: string, query?: GetApplicationsQuery) => {
    const params = new URLSearchParams();
    if (query?.offset !== undefined)
      params.append('offset', String(query.offset));
    if (query?.limit !== undefined) params.append('limit', String(query.limit));

    const queryString = params.toString();
    const url = `/users/${userId}/alerts${queryString ? `?${queryString}` : ''}`;

    const response = await api.get<AlertsResponse>(url);
    return response;
  },

  /**
   * 알림 읽음 처리
   * @param userId - 사용자 ID
   * @param alertId - 알림 ID
   * @returns 업데이트된 알림 목록
   */
  readAlert: async (userId: string, alertId: string) => {
    const response = await api.put<ReadAlertResponse>(
      `/users/${userId}/alerts/${alertId}`
    );
    return response;
  },
};

export default alert;
