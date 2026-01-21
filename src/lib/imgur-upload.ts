/**
 * Imgur API를 사용한 간단한 이미지 업로드
 * 무료 티어: 12,500 uploads/day
 */

const IMGUR_CLIENT_ID = process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID;

export async function uploadToImgur(file: File): Promise<string | null> {
  if (!IMGUR_CLIENT_ID) {
    console.error('IMGUR_CLIENT_ID가 설정되지 않았습니다.');
    return null;
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      return data.data.link; // 이미지 URL 반환
    }

    return null;
  } catch (error) {
    console.error('Imgur 업로드 실패:', error);
    return null;
  }
}
