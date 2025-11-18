import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';
import { requireAuth } from '@/src/lib/auth';

// PATCH /api/tags/[id] - 태그 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = requireAuth(request);
    const { id } = params;

    // 1. 태그 소유권 확인
    const { data: existingTag, error: fetchError } = await supabase
      .from('tags')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingTag) {
      return NextResponse.json(
        { error: '태그를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (existingTag.user_id !== user.id) {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    // 2. 요청 데이터 파싱
    const body = await request.json();
    const { emoji, name, color } = body;

    // 3. 검증
    if (emoji && emoji.length > 10) {
      return NextResponse.json(
        { error: 'emoji는 10자 이하여야 합니다.' },
        { status: 400 }
      );
    }

    if (name && name.length > 50) {
      return NextResponse.json(
        { error: 'name은 50자 이하여야 합니다.' },
        { status: 400 }
      );
    }

    // 4. DB 업데이트
    const updateData: any = {};
    if (emoji !== undefined) updateData.emoji = emoji;
    if (name !== undefined) updateData.name = name;
    if (color !== undefined) updateData.color = color;

    const { data, error } = await supabase
      .from('tags')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      // 중복 태그 체크
      if (error.code === '23505') {
        return NextResponse.json(
          { error: '이미 같은 이름의 태그가 존재합니다.' },
          { status: 409 }
        );
      }

      console.error('태그 수정 실패:', error);
      return NextResponse.json(
        { error: '태그 수정에 실패했습니다.' },
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

    console.error('태그 수정 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE /api/tags/[id] - 태그 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = requireAuth(request);
    const { id } = params;

    // 1. 태그 소유권 확인
    const { data: existingTag, error: fetchError } = await supabase
      .from('tags')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingTag) {
      return NextResponse.json(
        { error: '태그를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (existingTag.user_id !== user.id) {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    // 2. 사진에서 사용 중인지 체크
    const { data: photos } = await supabase
      .from('photos')
      .select('id')
      .eq('tag_id', id)
      .limit(1);

    if (photos && photos.length > 0) {
      return NextResponse.json(
        { error: '사진에서 사용 중인 태그는 삭제할 수 없습니다.' },
        { status: 409 }
      );
    }

    // 3. DB 삭제
    const { error } = await supabase.from('tags').delete().eq('id', id);

    if (error) {
      console.error('태그 삭제 실패:', error);
      return NextResponse.json(
        { error: '태그 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    console.error('태그 삭제 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
