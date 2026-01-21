-- =====================================================
-- 신규 유저 생성 시 기본 태그 자동 생성 트리거
-- =====================================================
-- 사용법:
-- 1. Supabase Dashboard → SQL Editor 접속
-- 2. 아래 스크립트 전체 복사/붙여넣기
-- 3. Run 버튼 클릭
-- =====================================================

-- 기존 트리거와 함수 삭제 (이미 존재할 경우)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.create_default_tags_for_new_user();

-- 신규 유저에게 기본 태그를 생성하는 함수
CREATE OR REPLACE FUNCTION public.create_default_tags_for_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- 신규 유저에게 기본 태그 2개 자동 생성
  INSERT INTO public.tags (user_id, emoji, name, color)
  VALUES 
    (NEW.id, '💪', '운동하기', '#FF5733'),
    (NEW.id, '⏰', '7시 기상', '#33C3FF');
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- 에러가 발생해도 유저 생성은 성공하도록 처리
    RAISE WARNING '기본 태그 생성 실패: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- auth.users 테이블에 트리거 연결
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_tags_for_new_user();

-- 확인용 코멘트
COMMENT ON FUNCTION public.create_default_tags_for_new_user() IS 
'신규 유저 생성 시 자동으로 기본 태그 2개(운동하기, 7시 기상)를 생성합니다.';
