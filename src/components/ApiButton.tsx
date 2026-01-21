'use client';

import Image from 'next/image';

export default function ApiButton() {
  const sendApiRequest = () => {
    window.location.href = '/api/auth/kakao';
  };

  return (
    <button className="cursor-pointer" onClick={sendApiRequest}>
      <Image
        src="/images/kakao_login_medium_narrow.png"
        alt="카카오 로그인"
        width={180}
        height={45}
      />
    </button>
  );
}

