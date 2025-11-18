# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com) 접속
2. **Start your project** 클릭
3. 프로젝트 이름 입력 (예: TIMO)
4. 리전 선택 (Northeast Asia - Seoul 추천)
5. 비밀번호 설정 후 생성

## 2. 데이터베이스 스키마 생성

1. Supabase 대시보드 좌측 메뉴 **SQL Editor** 클릭
2. **New query** 클릭
3. `supabase-schema.sql` 파일 내용 전체 복사
4. 붙여넣기 후 **Run** 클릭 (우측 하단)

## 3. 환경 변수 설정

1. Supabase 대시보드 좌측 메뉴 **Settings** → **API** 클릭
2. 다음 값 복사:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** 키 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. `.env.local` 파일에 추가:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Kakao (기존 값 유지)
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-client-secret
KAKAO_REDIRECT_URI=http://localhost:3000/api/auth/kakao/callback
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 4. 패키지 설치

```bash
npm install @supabase/supabase-js
```

## 5. 카카오 로그인 시 유저 자동 생성 (선택)

`src/app/api/auth/kakao/callback/route.ts` 파일에서 유저 정보 저장 로직 추가:

```typescript
import { supabase } from '@/src/lib/supabase';

// 사용자 정보 처리 부분 (87번 줄 근처)
const userData = {
  id: userInfo.id,
};

// DB에 유저 저장 (없으면 생성, 있으면 무시)
await supabase.from('users').upsert({
  id: String(userData.id),
  email: userInfo.kakao_account?.email,
  nickname: userInfo.properties?.nickname,
  profile_image: userInfo.properties?.profile_image,
});
```

## 6. 테스트

서버 재시작 후:

```bash
# 헬스체크
curl http://localhost:3000/api/health

# 태그 조회 (로그인 필요)
curl http://localhost:3000/api/tags

# 태그 생성
curl -X POST http://localhost:3000/api/tags \
  -H "Content-Type: application/json" \
  -d '{"emoji":"🎯","name":"운동","color":"#FF5733"}'
```

## 7. Supabase 대시보드에서 데이터 확인

1. 좌측 메뉴 **Table Editor** 클릭
2. `tags` 테이블 선택
3. 생성된 데이터 확인

## 트러블슈팅

### 오류: "Supabase 환경 변수가 설정되지 않았습니다."

→ `.env.local` 파일 확인, 서버 재시작

### 오류: "relation 'tags' does not exist"

→ SQL Editor에서 `supabase-schema.sql` 재실행

### 태그 조회 시 401 오류

→ 카카오 로그인 후 쿠키 확인 (`test_user`)
