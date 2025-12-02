import { api } from '../client';
import {
  GetApplicationsQuery,
  ApplicationsResponse,
  UpdateApplicationResponse,
  UpdateApplicationRequest,
} from '../types';

const applications = {
  // 가게의 특정 공고의 지원 목록 조회
  getApplications: async (
    shop_id: string,
    notice_id: string,
    query?: GetApplicationsQuery
  ) => {
    return api.get<ApplicationsResponse>(
      `/shops/${shop_id}/notices/${notice_id}/applications`,
      {
        params: query,
      }
    );
  },

  // 가게의 특정 공고 지원 등록
  postApplications: async (shop_id: string, notice_id: string) => {
    return api.post<UpdateApplicationResponse>(
      `/shops/${shop_id}/notices/${notice_id}`
    );
  },

  // 가게의 특정 공고 지원 승인, 거절 또는 취소
  updateApplicationStatus: async (
    shop_id: string,
    notice_id: string,
    application_id: string,
    data: UpdateApplicationRequest
  ) => {
    return api.put<UpdateApplicationResponse>(
      `/shops/${shop_id}/notices/${notice_id}/applications/${application_id}`,
      data
    );
  },
};
export default applications;
