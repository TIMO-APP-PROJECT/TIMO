import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { requireAuth } from '@/lib/auth';

// GET /api/tags - 태그 목록 조회
export async function GET(request: NextRequest) {
  try {
    // 1. 인증 확인
    const user = await requireAuth();
    const supabase = await createClient();

    // 2. 쿼리 파라미터
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    // 3. DB 조회
    let query = supabase
      .from('tags')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // 월별 필터 (선택)
    if (year && month) {
      const startDate = `${year}-${month.padStart(2, '0')}-01`;
      const endDate = new Date(parseInt(year), parseInt(month), 0)
        .toISOString()
        .split('T')[0];

      query = query.gte('created_at', startDate).lte('created_at', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('태그 조회 실패:', error);
      return NextResponse.json(
        { error: '태그 조회에 실패했습니다.' },
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

    console.error('태그 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/tags - 태그 생성
export async function POST(request: NextRequest) {
  try {
    // 1. 인증 확인
    const user = await requireAuth();
    const supabase = await createClient();

    // 2. 요청 데이터 파싱
    const body = await request.json();
    const { emoji, name, color } = body;

    // 3. 검증 (나중에 zod로 개선)
    if (!emoji || !name) {
      return NextResponse.json(
        { error: 'emoji와 name은 필수입니다.' },
        { status: 400 }
      );
    }

    if (emoji.length > 10) {
      return NextResponse.json(
        { error: 'emoji는 10자 이하여야 합니다.' },
        { status: 400 }
      );
    }

    if (name.length > 50) {
      return NextResponse.json(
        { error: 'name은 50자 이하여야 합니다.' },
        { status: 400 }
      );
    }

    // 4. DB 저장
    const { data, error } = await supabase
      .from('tags')
      .insert({
        user_id: user.id,
        emoji,
        name,
        color: color || '#FF5733',
      })
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

      console.error('태그 생성 실패:', error);
      return NextResponse.json(
        { error: '태그 생성에 실패했습니다.' },
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

    console.error('태그 생성 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
