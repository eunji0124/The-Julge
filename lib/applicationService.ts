import { applyNotice, cancelApplication } from '@/apis/notices';
import users from '@/apis/users';

export class ApplicationService {
  // 프로필 등록 여부 확인
  static async checkProfileRegistered(userId: string): Promise<boolean> {
    const userResponse = await users.getProfile(userId);
    return users.checkProfileRegistered(userResponse.item);
  }

  // 공고 신청
  static async applyToNotice(shopId: string, noticeId: string) {
    const response = await applyNotice(shopId, noticeId);
    return {
      applicationId: response?.item?.id || null,
    };
  }

  // 신청 취소
  static async cancelNoticeApplication(
    shopId: string,
    noticeId: string,
    applicationId: string
  ) {
    await cancelApplication(shopId, noticeId, applicationId);
  }
}
