'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserData {
  id: number;
}

export default function TestUserPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 쿠키에서 사용자 정보 가져오기
    const userCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('test_user='));

    if (userCookie) {
      try {
        const userDataStr = decodeURIComponent(userCookie.split('=')[1]);
        const user = JSON.parse(userDataStr);
        setUserData(user);
      } catch (error) {
        console.error('사용자 정보 파싱 실패:', error);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    // 쿠키 삭제
    document.cookie =
      'test_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  if (!userData) {
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
          테스트 유저 정보
        </h1>

        <div className="space-y-4 mb-6">
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">사용자 ID</p>
            <p className="text-xl font-bold text-gray-800">{userData.id}</p>
          </div>
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
