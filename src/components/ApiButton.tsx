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
