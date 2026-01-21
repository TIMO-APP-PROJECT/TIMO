import { createClient } from '@/utils/supabase/client';
import { compressImage } from './compress-image';

export interface UploadImageResult {
  url: string;
  path: string;
  error?: string;
}

/**
 * 이미지를 Supabase Storage에 업로드
 * @param file - 업로드할 이미지 파일
 * @param folder - 저장할 폴더 (선택, 기본값: user_id/YYYY-MM-DD)
 * @returns 업로드된 이미지의 Public URL과 Storage Path
 */
export async function uploadImage(
  file: File,
  folder?: string
): Promise<UploadImageResult> {
  try {
    const supabase = createClient();

    // 1. 현재 로그인한 유저 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { url: '', path: '', error: '로그인이 필요합니다.' };
    }

    // 2. 파일 검증
    if (!file.type.startsWith('image/')) {
      return { url: '', path: '', error: '이미지 파일만 업로드 가능합니다.' };
    }

    // 3. 이미지 압축 (1MB 이하, 1920px 이하로 자동 압축)
    console.log(`원본 파일: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    const compressedFile = await compressImage(file, {
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 0.8,
      maxSizeMB: 1,
    });
    console.log(
      `압축 완료: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`
    );

    // 4. 파일명 생성 (충돌 방지)
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomString}.${fileExt}`;

    // 5. 저장 경로 생성 (user_id/YYYY-MM-DD/filename)
    const today = new Date().toISOString().split('T')[0];
    const folderPath = folder || `${user.id}/${today}`;
    const filePath = `${folderPath}/${fileName}`;

    // 6. Supabase Storage에 업로드 (압축된 파일)
    const { data, error } = await supabase.storage
      .from('photos')
      .upload(filePath, compressedFile, {
        cacheControl: '3600',
        upsert: false, // 같은 이름 파일 덮어쓰기 방지
      });

    if (error) {
      console.error('이미지 업로드 실패:', error);
      return { url: '', path: '', error: error.message };
    }

    // 7. Public URL 생성
    const {
      data: { publicUrl },
    } = supabase.storage.from('photos').getPublicUrl(data.path);

    return {
      url: publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error('이미지 업로드 오류:', error);
    return {
      url: '',
      path: '',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    };
  }
}

/**
 * Supabase Storage에서 이미지 삭제
 * @param path - 삭제할 이미지의 storage path
 */
export async function deleteImage(path: string): Promise<boolean> {
  try {
    const supabase = createClient();

    const { error } = await supabase.storage.from('photos').remove([path]);

    if (error) {
      console.error('이미지 삭제 실패:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('이미지 삭제 오류:', error);
    return false;
  }
}

/**
 * 이미지 파일 미리보기 URL 생성
 * @param file - 미리보기할 파일
 * @returns 임시 blob URL
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * 미리보기 URL 메모리 해제
 * @param url - 해제할 blob URL
 */
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url);
}
