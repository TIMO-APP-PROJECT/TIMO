import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { requireAuth } from '@/lib/auth';

// GET /api/photos/[id] - 게시글 단일 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();
    const { id } = params;

    const { data, error } = await supabase
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
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
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

// PATCH /api/photos/[id] - 게시글 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();
    const { id } = params;

    const body = await request.json();
    const { tag_id, memo } = body;

    // 업데이트할 필드만 선택
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (tag_id !== undefined) {
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
      updateData.tag_id = tag_id;
    }

    if (memo !== undefined) {
      updateData.memo = memo;
    }

    const { data, error } = await supabase
      .from('photos')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
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

    if (error || !data) {
      return NextResponse.json(
        { error: '게시글 수정에 실패했습니다.' },
        { status: 404 }
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

    console.error('게시글 수정 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE /api/photos/[id] - 게시글 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();
    const { id } = params;

    const { error } = await supabase
      .from('photos')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('게시글 삭제 실패:', error);
      return NextResponse.json(
        { error: '게시글 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: '게시글이 삭제되었습니다.' });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    console.error('게시글 삭제 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
