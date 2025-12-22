'use client';

import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isDev = process.env.NODE_ENV === 'development';
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        router.replace('/');
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        router.replace('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  const handleDevLogin = () => {
    setLoading(true);
    router.push('/auth/callback?dev_user=true&next=/');
  };

  const handleKakaoLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/`,
        },
      });

      if (error) {
        console.error('로그인 실패:', error);
        alert('로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          로그인 테스트
        </h1>
        <p className="text-gray-600 text-center mb-8">
          개발 테스트용 로그인 페이지입니다
        </p>

        {isDev && (
          <button
            className="w-full mb-4 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium transition-colors"
            onClick={handleDevLogin}
            disabled={loading}
          >
            개발 모드 빠른 로그인
          </button>
        )}

        <button
          className="cursor-pointer disabled:opacity-50"
          onClick={handleKakaoLogin}
          disabled={loading}
        >
          <Image
            src="/images/kakao_login_medium_narrow.png"
            alt="카카오 로그인"
            width={180}
            height={45}
          />
        </button>
      </div>
    </div>
  );
}
