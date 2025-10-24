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

function word(word: string) {
  return word;
}

word('h');

function d(): string {
  console.log('#');
  return;
}

d();

function fetchTodoItems() {
  const todos = [
    { id: 1, title: '안녕', done: false },
    { id: 2, title: '타입', done: false },
    { id: 3, title: '스크립트', done: false },
  ];
  return todos;
}
