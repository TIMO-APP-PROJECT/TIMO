import { NextResponse } from 'next/server';

export async function GET() {
  const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
  const REDIRECT_URI =
    process.env.KAKAO_REDIRECT_URI ||
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/kakao/callback`;

  if (!KAKAO_CLIENT_ID) {
    return NextResponse.json(
      { error: '카카오 클라이언트 ID가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  // 카카오 로그인 URL 생성
  const kakaoAuthUrl = new URL('https://kauth.kakao.com/oauth/authorize');
  kakaoAuthUrl.searchParams.set('client_id', KAKAO_CLIENT_ID);
  kakaoAuthUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  kakaoAuthUrl.searchParams.set('response_type', 'code');

  // 카카오 로그인 페이지로 리다이렉트
  return NextResponse.redirect(kakaoAuthUrl.toString());
}
