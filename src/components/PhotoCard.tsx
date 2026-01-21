interface PhotoCardProps {
  photo: {
    id: string;
    image_url: string;
    memo: string | null;
    created_at: string;
    tags: {
      id: string;
      emoji: string;
      name: string;
      color: string;
    };
  };
}

export default function PhotoCard({ photo }: PhotoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* 이미지 */}
      <div className="relative aspect-square">
        <img
          src={photo.image_url}
          alt={photo.memo || '사진'}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 내용 */}
      <div className="p-4">
        {/* 태그 */}
        <div
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mb-2"
          style={{
            backgroundColor: `${photo.tags.color}20`,
            color: photo.tags.color,
          }}
        >
          <span>{photo.tags.emoji}</span>
          <span>{photo.tags.name}</span>
        </div>

        {/* 메모 */}
        {photo.memo && (
          <p className="text-gray-700 text-sm line-clamp-2 mb-2">
            {photo.memo}
          </p>
        )}

        {/* 날짜 */}
        <p className="text-gray-400 text-xs">
          {new Date(photo.created_at).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
}
