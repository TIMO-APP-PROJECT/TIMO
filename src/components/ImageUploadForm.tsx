'use client';

import { useState, useRef } from 'react';
import {
  uploadImage,
  createImagePreview,
  revokeImagePreview,
} from '@/lib/upload-image';

interface ImageUploadFormProps {
  onUploadComplete?: (imageUrl: string, imagePath: string) => void;
}

export default function ImageUploadForm({
  onUploadComplete,
}: ImageUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const handleUpload = async () => {
    if (!file) {
      setError('파일을 선택해주세요.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const result = await uploadImage(file);

      if (result.error) {
        setError(result.error);
        return;
      }

      // 업로드 성공
      onUploadComplete?.(result.url, result.path);

      // 초기화
      setFile(null);
      setPreviewUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError('업로드 중 오류가 발생했습니다.');
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
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* 파일 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          이미지 선택
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50"
        />
        <p className="mt-1 text-xs text-gray-500">
          최대 10MB, 이미지 파일만 가능
        </p>
      </div>

      {/* 미리보기 */}
      {previewUrl && (
        <div className="relative">
          <img
            src={previewUrl}
            alt="미리보기"
            className="w-full max-h-96 object-contain rounded-lg border"
          />
          {!uploading && (
            <button
              onClick={handleCancel}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* 업로드 버튼 */}
      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {uploading ? '업로드 중...' : '업로드'}
        </button>
      )}
    </div>
  );
}
