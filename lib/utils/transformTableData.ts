import { ApplicationItem } from '@/api/types';
import { formatPay } from '@/lib/utils/formatPay';
import { formatWorkTime } from '@/lib/utils/formatWorkTime';
// 사장님: API 응답 타입 정의
interface EmployerApiItem {
  item: {
    id: string;
    status: string;
    user: {
      item: {
        name: string;
        phone: string;
        bio: string;
      };
    };
  };
}

// 알바님: API 응답 타입 정의
interface EmployeeApiItem {
  item: {
    id: string;
    status: string;
    shop: {
      item: {
        name: string;
      };
    };
    notice: {
      item: {
        hourlyPay: number;
        startsAt: string;
        workhour: number;
      };
    };
  };
}

// 사장님: 테이블 데이터 타입 정의
export interface EmployerTableData extends Record<string, React.ReactNode> {
  id: string;
  name: string;
  bio: string;
  phone: string;
  status: string;
}

// 알바님: 테이블 데이터 타입 정의
export interface EmployeeTableData extends Record<string, React.ReactNode> {
  id: string;
  shop: string;
  workhour: string;
  hourlyPay: string;
  status: string;
}

/**
 * 사장님용 API 데이터를 테이블 데이터로 변환
 */
export const transformEmployerData = (
  items: EmployerApiItem[]
): EmployerTableData[] => {
  return items.map((item) => ({
    id: item.item.id,
    name: item.item.user.item.name,
    bio: item.item.user.item.bio,
    phone: item.item.user.item.phone,
    status: item.item.status,
  }));
};

/**
 * 알바님용 API 데이터를 테이블 데이터로 변환
 */
export const transformEmployeeData = (
  items: EmployeeApiItem[]
): EmployeeTableData[] => {
  return items.map((item) => ({
    id: item.item.id,
    shop: item.item.shop.item.name,
    workhour: formatWorkTime(
      item.item.notice.item.startsAt,
      item.item.notice.item.workhour
    ).text,
    hourlyPay: formatPay(item.item.notice.item.hourlyPay),
    status: item.item.status,
  }));
};

// transformTableData.ts
export const transformApplicationData = (items: ApplicationItem[]) => {
  return items.map((app) => ({
    id: app.id,
    name: app.user.item.name ?? '',
    bio: app.user.item.bio ?? '',
    phone: app.user.item.phone ?? '',
    status: app.status,
  }));
};
