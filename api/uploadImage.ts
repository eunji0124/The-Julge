
import { api } from './client';

/**
 * Presigned URL 응답 타입
 */
interface PresignedUrlResponse {
  item: {
    url: string;
  };
  links: Array<unknown>;
}

/**
 * 1. Presigned URL 생성
 * @param fileName - 업로드할 파일명
 * @returns Presigned URL
 */
async function getPresignedUrl(fileName: string): Promise<string> {
  const response = await api.post<PresignedUrlResponse>('/images', {
    name: fileName,
  });

  return response.item.url;
}

/**
 * 2. S3로 이미지 업로드
 * @param presignedUrl - Presigned URL (query parameters 포함)
 * @param file - 업로드할 파일
 */
export async function uploadToS3(
  presignedUrl: string,
  file: File
): Promise<void> {
  await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
}

/**
 * query parameters를 제거한 URL 반환
 * @param presignedUrl - Presigned URL
 * @returns query parameters가 제거된 URL
 */
export function removeQueryParams(presignedUrl: string): string {
  return presignedUrl.split('?')[0];
}

/**
 * 이미지 업로드 통합 함수
 * @param file - 업로드할 파일
 * @returns 업로드된 이미지의 최종 URL (query parameters 제외)
 */
export async function uploadImage(file: File): Promise<string> {
  // 1. Presigned URL 생성
  const presignedUrl = await getPresignedUrl(file.name);

  // 2. S3로 이미지 업로드
  await uploadToS3(presignedUrl, file);

  // 3. query parameters 제거한 최종 URL 반환
  return removeQueryParams(presignedUrl);
}

