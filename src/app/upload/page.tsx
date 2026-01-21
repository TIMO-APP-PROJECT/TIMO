'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  uploadImage,
  createImagePreview,
  revokeImagePreview,
} from '@/lib/upload-image';

interface Tag {
  id: string;
  emoji: string;
  name: string;
  color: string;
}

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 상태 관리
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagId, setSelectedTagId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [memo, setMemo] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // 태그 목록 조회
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      if (!response.ok) throw new Error('태그 조회 실패');

      const data = await response.json();
      setTags(data);

      // 첫 번째 태그를 기본 선택
      if (data.length > 0) {
        setSelectedTagId(data[0].id);
      }
    } catch (err) {
      setError('태그를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // 이전 미리보기 URL 메모리 해제
    if (previewUrl) {
      revokeImagePreview(previewUrl);
    }

    setFile(selectedFile);
    setPreviewUrl(createImagePreview(selectedFile));
    setError('');
  };

  // 업로드 핸들러
  const handleSubmit = async () => {
    if (!file) {
      setError('이미지를 선택해주세요.');
      return;
    }

    if (!selectedTagId) {
      setError('태그를 선택해주세요.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // 1. 이미지 업로드 (Supabase Storage)
      const uploadResult = await uploadImage(file);

      if (uploadResult.error) {
        setError(uploadResult.error);
        setUploading(false);
        return;
      }

      // 2. Photos API 호출
      const response = await fetch('/api/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tag_id: selectedTagId,
          image_url: uploadResult.url,
          image_path: uploadResult.path,
          memo: memo || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '게시글 생성 실패');
      }

      // 성공 - 메인 페이지로 이동
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '업로드 중 오류 발생');
    } finally {
      setUploading(false);
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    if (previewUrl) {
      revokeImagePreview(previewUrl);
    }
    setFile(null);
    setPreviewUrl('');
    setMemo('');
    setError('');
  };

  const selectedTag = tags.find((t) => t.id === selectedTagId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">먼저 태그를 생성해주세요.</p>
          <button
            onClick={() => router.push('/settings')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            설정으로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 헤더 */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
        <button onClick={() => router.back()} className="p-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">수정하기</h1>
        <button
          onClick={handleSubmit}
          disabled={uploading || !file || !selectedTagId}
          className="p-2 disabled:opacity-30"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
      </div>

      <div className="px-5 py-6 space-y-6">
        {/* 메인 이미지 카드 */}
        <div className="relative aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden">
          {previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt="미리보기"
                className="w-full h-full object-cover"
              />
              {/* 이미지 위 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* 우측 상단 이미지 변경 버튼 */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute top-4 right-4 w-12 h-12 bg-gray-400/80 rounded-full flex items-center justify-center backdrop-blur-sm"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>

              {/* 하단 정보 */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-2">
                {selectedTag && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-pink-500 rounded-full text-sm font-medium">
                    <span>{selectedTag.emoji}</span>
                    <span>{selectedTag.name}</span>
                  </div>
                )}
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="제목을 입력하세요"
                  className="w-full bg-transparent text-white text-2xl font-bold placeholder-white/70 border-none outline-none"
                />
                <p className="text-sm text-white/80">
                  {selectedDate.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  }).replace(/\. /g, '').replace('.', '')}
                </p>
              </div>
            </>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-full flex flex-col items-center justify-center text-gray-400"
            >
              <svg
                className="w-16 h-16 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm">사진을 선택하세요</p>
            </button>
          )}
        </div>

        {/* 숨겨진 파일 input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* 태그 설정하기 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">태그 설정하기</h2>
            <button className="p-1">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => router.push('/settings')}
              className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-full text-sm font-medium text-gray-600 hover:border-gray-400"
            >
              + 태그추가하기
            </button>
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setSelectedTagId(tag.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTagId === tag.id
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{tag.emoji}</span> {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* 시간 설정하기 */}
        <div>
          <h2 className="font-semibold mb-3">시간 설정하기</h2>
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-gray-600">
              {selectedDate.toLocaleDateString('ko-KR', {
                month: '2-digit',
                day: '2-digit',
                weekday: 'short',
              })}{' '}
              {selectedDate.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <button className="p-1">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
