'use client';

import { useState, useEffect } from 'react';
import PhotoCard from './PhotoCard';

interface Tag {
  id: string;
  emoji: string;
  name: string;
  color: string;
}

interface Photo {
  id: string;
  image_url: string;
  memo: string | null;
  created_at: string;
  tags: Tag;
}

export default function PhotoList() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 데이터 로드
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 태그 목록 조회
      const tagsResponse = await fetch('/api/tags');
      if (tagsResponse.ok) {
        const tagsData = await tagsResponse.json();
        setTags(tagsData);
      }

      // 게시글 목록 조회
      await fetchPhotos();
    } catch (err) {
      setError('데이터를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPhotos = async (tagId?: string) => {
    try {
      const url = tagId ? `/api/photos?tag_id=${tagId}` : '/api/photos';
      const response = await fetch(url);

      if (!response.ok) throw new Error('게시글 조회 실패');

      const data = await response.json();
      setPhotos(data);
    } catch (err) {
      setError('게시글을 불러올 수 없습니다.');
    }
  };

  // 태그 필터 변경
  const handleTagFilter = (tagId: string | null) => {
    setSelectedTagId(tagId);
    fetchPhotos(tagId || undefined);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 태그 필터 */}
      {tags.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => handleTagFilter(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedTagId === null
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            전체
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagFilter(tag.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedTagId === tag.id
                  ? 'text-white'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor:
                  selectedTagId === tag.id ? tag.color : `${tag.color}20`,
                color: selectedTagId === tag.id ? 'white' : tag.color,
              }}
            >
              {tag.emoji} {tag.name}
            </button>
          ))}
        </div>
      )}

      {/* 게시글 목록 */}
      {photos.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">
            {selectedTagId
              ? '해당 태그의 게시글이 없습니다.'
              : '아직 업로드한 사진이 없습니다.'}
          </p>
          <a
            href="/upload"
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            사진 업로드하기
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      )}
    </div>
  );
}
