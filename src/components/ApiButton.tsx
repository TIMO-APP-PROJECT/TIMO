'use client';

export default function ApiButton() {
  const sendApiRequest = () => {
    fetch('/api/test')
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));
  };

  return (
    <button
      className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
      onClick={sendApiRequest}
    >
      send api request
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
