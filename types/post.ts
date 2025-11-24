// 공통으로 쓰이는 props
export interface BasePostProps {
  isColor: boolean;
  percentage?: number;
}

// 각 컴포넌트 전용 props
export interface WorkInfo {
  text: string;
  isExpired: boolean;
}

export interface PostTimeProps extends BasePostProps {
  workInfo: WorkInfo;
}

export interface PostLocationProps extends BasePostProps {
  location: string;
}

export interface PostWageProps extends BasePostProps {
  wage: number;
  getBadgeColor: (percentage: number, isBackground?: boolean) => string;
}

export interface PostImageProps {
  imageUrl: string;
  name: string;
  isColor: boolean;
  overlayText?: string;
}

export interface BadgeProps {
  percentage: number;
  isColor: boolean;
  getBadgeColor: (percentage: number, isBackground?: boolean) => string;
}
