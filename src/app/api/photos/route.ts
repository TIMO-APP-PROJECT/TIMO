import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { requireAuth } from '@/lib/auth';

// GET /api/photos - 게시글 목록 조회
export async function GET(request: NextRequest) {
  try {
    // 1. 인증 확인
    const user = await requireAuth();
    const supabase = await createClient();

    // 2. 쿼리 파라미터
    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get('tag_id');

    // 3. DB 조회 (태그 정보 포함)
    let query = supabase
      .from('photos')
      .select(
        `
        *,
        tags (
          id,
          emoji,
          name,
          color
        )
      `
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // 특정 태그 필터링
    if (tagId) {
      query = query.eq('tag_id', tagId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('게시글 조회 실패:', error);
      return NextResponse.json(
        { error: '게시글 조회에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    console.error('게시글 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/photos - 게시글 업로드
export async function POST(request: NextRequest) {
  try {
    // 1. 인증 확인
    const user = await requireAuth();
    const supabase = await createClient();

    // 2. 요청 데이터 파싱
    const body = await request.json();
    const { tag_id, image_url, image_path, memo } = body;

    // 3. 검증
    if (!tag_id || !image_url) {
      return NextResponse.json(
        { error: 'tag_id와 image_url은 필수입니다.' },
        { status: 400 }
      );
    }

    // 태그가 사용자의 것인지 확인
    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .select('id')
      .eq('id', tag_id)
      .eq('user_id', user.id)
      .single();

    if (tagError || !tag) {
      return NextResponse.json(
        { error: '유효하지 않은 태그입니다.' },
        { status: 400 }
      );
    }

    // 4. DB 저장
    const { data, error } = await supabase
      .from('photos')
      .insert({
        user_id: user.id,
        tag_id,
        image_url,
        image_path: image_path || null,
        memo: memo || null,
      })
      .select(
        `
        *,
        tags (
          id,
          emoji,
          name,
          color
        )
      `
      )
      .single();

    if (error) {
      console.error('게시글 생성 실패:', error);
      return NextResponse.json(
        { error: '게시글 생성에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    console.error('게시글 생성 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
