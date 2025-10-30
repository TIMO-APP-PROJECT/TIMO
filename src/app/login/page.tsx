'use client';

import Image from 'next/image';

export default function LoginPage() {
  const handleKakaoLogin = () => {
    window.location.href = '/api/auth/kakao';
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
        <button className="cursor-pointer" onClick={handleKakaoLogin}>
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

