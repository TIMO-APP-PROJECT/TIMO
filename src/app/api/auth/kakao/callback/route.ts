import { NextRequest, NextResponse } from 'next/server';
import { KakaoTokenResponse, KakaoUserInfo } from '@/types/kakao';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.json(
      { error: `카카오 로그인 실패: ${error}` },
      { status: 400 }
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: '인가 코드가 없습니다.' },
      { status: 400 }
    );
  }

  const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
  const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
  const REDIRECT_URI =
    process.env.KAKAO_REDIRECT_URI ||
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/kakao/callback`;

  console.log('환경변수 확인:', {
    hasClientId: !!KAKAO_CLIENT_ID,
    hasClientSecret: !!KAKAO_CLIENT_SECRET,
    redirectUri: REDIRECT_URI,
  });

  if (!KAKAO_CLIENT_ID || !KAKAO_CLIENT_SECRET) {
    return NextResponse.json(
      { error: '카카오 클라이언트 설정이 완료되지 않았습니다.' },
      { status: 500 }
    );
  }

  try {
    // 1. 인가 코드로 액세스 토큰 요청
    const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: KAKAO_CLIENT_ID,
        client_secret: KAKAO_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code: code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('토큰 요청 실패:', errorData);
      return NextResponse.json(
        { error: '토큰 요청에 실패했습니다.' },
        { status: 400 }
      );
    }

    const tokenData: KakaoTokenResponse = await tokenResponse.json();

    // 2. 액세스 토큰으로 사용자 정보 요청
    const userInfoResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      return NextResponse.json(
        { error: '사용자 정보 요청에 실패했습니다.' },
        { status: 400 }
      );
    }

    const userInfo: KakaoUserInfo = await userInfoResponse.json();

    console.log('카카오 사용자 정보:', JSON.stringify(userInfo, null, 2));

    // 3. 사용자 정보 처리 (여기서는 간단히 반환)
    const userData = {
      id: userInfo.id,
    };

    // 실제 프로젝트에서는 여기서 데이터베이스에 사용자 정보를 저장하거나
    // JWT 토큰을 생성하여 세션을 관리할 수 있습니다.

    // 개발 테스트용: 사용자 정보를 쿠키에 저장하고 /test-user로 리다이렉트
    const testUserData = {
      id: userData.id,
    };

    const redirectResponse = NextResponse.redirect(
      new URL('/test-user', request.url)
    );

    // 쿠키에 사용자 정보 저장 (1시간 유효)
    redirectResponse.cookies.set('test_user', JSON.stringify(testUserData), {
      httpOnly: false, // 클라이언트에서 접근 가능하도록
      maxAge: 60 * 60, // 1시간
      path: '/',
    });

    return redirectResponse;
  } catch (error) {
    console.error('카카오 로그인 처리 중 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
