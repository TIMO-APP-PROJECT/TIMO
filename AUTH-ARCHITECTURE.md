# Supabase 서버 사이드 인증 구조

## 전체 흐름

```
1. 사용자가 로그인 버튼 클릭 (클라이언트)
   ↓
2. Supabase OAuth 시작 → Kakao 인증 페이지
   ↓
3. Kakao 로그인 성공 → code와 함께 /auth/callback 리다이렉트
   ↓
4. 서버에서 code를 session으로 교환 (서버 사이드)
   ↓
5. 쿠키에 세션 저장 → 최종 목적지로 리다이렉트
   ↓
6. 이후 모든 요청에서 쿠키의 세션으로 인증
```

## 파일 구조

### 인증 관련

```
src/
├── utils/supabase/
│   ├── client.ts          # 클라이언트 컴포넌트용
│   └── server.ts          # 서버 컴포넌트/API 라우트용
│
├── lib/
│   └── auth.ts            # 인증 헬퍼 (getCurrentUser, requireAuth)
│
└── app/
    ├── login/
    │   └── page.tsx       # 로그인 페이지 (클라이언트)
    │
    ├── auth/
    │   ├── callback/
    │   │   └── route.ts   # OAuth 콜백 처리 (서버)
    │   └── auth-code-error/
    │       └── page.tsx   # 에러 페이지
    │
    └── test-user/
        └── page.tsx       # 유저 정보 확인 (클라이언트)
```

## 사용 방법

### 1. 클라이언트 컴포넌트 (`'use client'`)

```typescript
import { createClient } from '@/utils/supabase/client';

export default function MyPage() {
  const supabase = createClient();

  // 로그인
  await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
    },
  });

  // 현재 유저 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그아웃
  await supabase.auth.signOut();
}
```

### 2. 서버 컴포넌트

```typescript
import { createClient } from '@/utils/supabase/server';

export default async function ServerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <div>Hello {user.email}</div>;
}
```

### 3. API 라우트 (Route Handlers)

```typescript
import { createClient } from '@/utils/supabase/server';
import { requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  // 인증 필수
  const user = await requireAuth();

  // Supabase 클라이언트
  const supabase = await createClient();

  // RLS가 자동으로 user_id 체크함
  const { data } = await supabase.from('tags').select('*');

  return NextResponse.json(data);
}
```

## 핵심 차이점

### ❌ 잘못된 사용

```typescript
// 클라이언트와 서버 혼용
import { supabase } from '@/lib/supabase'; // 싱글톤 인스턴스

// 서버에서 사용 시 세션 공유 문제 발생!
```

### ✅ 올바른 사용

```typescript
// 클라이언트: 매번 새 인스턴스
import { createClient } from '@/utils/supabase/client';
const supabase = createClient();

// 서버: 쿠키 기반 인스턴스
import { createClient } from '@/utils/supabase/server';
const supabase = await createClient();
```

## 콜백 라우트의 역할

`/auth/callback/route.ts`는 **OAuth code를 세션으로 교환**합니다:

```typescript
// Kakao에서 받은 code
const code = searchParams.get('code');

// code → session 교환 (서버에서만 가능)
await supabase.auth.exchangeCodeForSession(code);

// 쿠키에 세션 저장됨 → 이후 모든 요청에서 사용
```

**왜 필요한가?**

- OAuth의 보안을 위해 **code exchange는 서버에서만** 수행
- 클라이언트에서 하면 보안 위험
- 교환된 세션은 httpOnly 쿠키에 저장되어 안전함

## Redirect URLs 설정

### Supabase Dashboard

```
Authentication → URL Configuration → Redirect URLs

개발: http://localhost:3000/auth/callback
배포: https://yourdomain.com/auth/callback
```

### Kakao Developers

```
내 애플리케이션 → 카카오 로그인 → Redirect URI

https://[your-project-id].supabase.co/auth/v1/callback
```

## 트러블슈팅

### "code 파라미터 없음"

→ Redirect URLs 설정 확인

### "세션 교환 실패"

→ Kakao Developer Console의 Redirect URI 확인

### "UNAUTHORIZED"

→ 로그인되지 않은 상태에서 API 호출

### RLS 오류

→ `supabase-schema-simple.sql`의 RLS 정책 확인
