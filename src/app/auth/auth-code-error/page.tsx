export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          로그인 실패
        </h1>
        <p className="text-gray-600 mb-6">
          인증 코드 처리 중 오류가 발생했습니다.
          다시 시도해주세요.
        </p>
        <a
          href="/login"
          className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          로그인 페이지로 돌아가기
        </a>
      </div>
    </div>
  );
}

