-- =====================================================
-- Supabase Storage 버킷 및 정책 설정
-- =====================================================
-- 사용법:
-- 1. Supabase Dashboard → SQL Editor
-- 2. New query 클릭
-- 3. 아래 스크립트 전체 복사/붙여넣기
-- 4. Run 버튼 클릭
-- =====================================================

-- 기존 정책 삭제 (있을 경우)
DROP POLICY IF EXISTS "Users can upload their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Public photos are viewable by everyone" ON storage.objects;

-- 1. photos 버킷 생성 (이미 존재하면 무시)
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. 스토리지 정책 설정

-- 2-1. 인증된 사용자는 자신의 폴더에 업로드 가능
CREATE POLICY "Users can upload their own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 2-2. 인증된 사용자는 자신의 사진 조회 가능
CREATE POLICY "Users can view their own photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 2-3. 인증된 사용자는 자신의 사진 삭제 가능
CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 2-4. 인증된 사용자는 자신의 사진 수정 가능
CREATE POLICY "Users can update their own photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
