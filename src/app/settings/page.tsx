'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export default function SettingsTab() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
      }
      setLoading(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            로그인 정보가 없습니다
          </h1>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          사용자 정보
        </h1>

        <div className="space-y-4 mb-6">
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">사용자 ID</p>
            <p className="text-sm font-mono text-gray-800 break-all">
              {user.id}
            </p>
          </div>

          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">이메일</p>
            <p className="text-lg text-gray-800">{user.email || '없음'}</p>
          </div>

          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">제공자</p>
            <p className="text-lg text-gray-800">
              {user.app_metadata.provider || 'kakao'}
            </p>
          </div>

          {user.user_metadata?.name && (
            <div className="border-b pb-3">
              <p className="text-sm text-gray-500 mb-1">닉네임</p>
              <p className="text-lg text-gray-800">{user.user_metadata.name}</p>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="w-full px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
