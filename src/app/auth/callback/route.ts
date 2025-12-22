import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';
  const isDev = process.env.NODE_ENV === 'development';

  // 개발 모드: dev_user 파라미터가 있으면 테스트 유저로 자동 로그인
  if (isDev && searchParams.get('dev_user') === 'true') {
    const supabase = await createClient();
    const testEmail = process.env.DEV_TEST_EMAIL;
    const testPassword = process.env.DEV_TEST_PASSWORD;

    if (testEmail && testPassword) {
      const { error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      console.error('테스트 유저 로그인 실패:', error);
    } else {
      console.error(
        '테스트 유저 환경변수 미설정: DEV_TEST_EMAIL, DEV_TEST_PASSWORD'
      );
    }
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }

    console.error('세션 교환 실패:', error);
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
