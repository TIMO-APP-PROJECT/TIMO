import { NextRequest, NextResponse } from 'next/server';
import { KakaoTokenResponse, KakaoUserInfo } from '@/types/kakao';
import { supabase } from '@/lib/supabase';
import { log } from 'console';

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
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const REDIRECT_URI = `${BASE_URL}/api/auth/kakao/callback`;

  if (!KAKAO_CLIENT_ID || !KAKAO_CLIENT_SECRET || !BASE_URL) {
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
    // 백엔드에서는 보안과 효율성을 이유로 여러가지 hook을 사용하는 것이 좋습니다.
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

    console.log('userInfo', String(userInfo.id));
    // 3. Supabase에 사용자 정보 저장 (upsert: 없으면 생성, 있으면 업데이트)
    const { data: savedUser, error: dbError } = await supabase
      .from('users')
      .upsert(
        {
          id: String(userInfo.id),
        },
        {
          onConflict: 'id',
        }
      )
      .select();

    console.log('DB 응답 - savedUser:', savedUser, 'dbError:', dbError);

    if (dbError) {
      console.error('DB 저장 실패:', dbError);
      return NextResponse.json(
        { error: '사용자 정보 저장에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 4. 쿠키에 사용자 정보 저장하고 /test-user로 리다이렉트
    const testUserData = {
      id: userInfo.id,
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
