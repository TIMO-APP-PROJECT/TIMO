-- =====================================================
-- photos 테이블에 image_path 컬럼 추가
-- =====================================================
-- Storage에서 이미지 삭제 시 필요한 경로 저장
-- =====================================================

-- image_path 컬럼 추가 (이미 존재하면 무시)
ALTER TABLE public.photos 
ADD COLUMN IF NOT EXISTS image_path text;

-- 코멘트 추가
COMMENT ON COLUMN public.photos.image_path IS 
'Supabase Storage의 이미지 경로 (예: user_id/2025-01-15/12345.jpg)';
