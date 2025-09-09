# TIMO Web

TIMO 프로젝트의 웹 애플리케이션입니다.

## 기술 스택

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Testing**: Jest + Testing Library
- **Storybook**: UI 컴포넌트 문서화

## 시작하기

### 필수 요구사항

- Node.js 20 이상
- npm 10.8.1

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 빌드
npm run build

# 프로덕션 서버 시작
npm run start
```

### 개발 도구

```bash
# 린팅
npm run lint

# 타입 체크
npm run type-check

# 테스트 실행
npm run test

# 테스트 watch 모드
npm run test:watch

# 커버리지 포함 테스트
npm run test:coverage

# 코드 포맷팅
npm run format

# 프로젝트 정리
npm run clean
```

## 프로젝트 구조

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # 루트 레이아웃
│   │   ├── page.tsx         # 홈 페이지
│   │   └── globals.css      # 글로벌 스타일
│   └── components/          # 재사용 가능한 컴포넌트
│       ├── Button.tsx
│       └── Button.test.tsx
├── public/                  # 정적 파일들
├── jest.config.ts           # Jest 설정
├── next.config.mjs          # Next.js 설정
├── tailwind.config.ts       # Tailwind CSS 설정
└── tsconfig.json           # TypeScript 설정
```

## 스크립트 설명

- `dev`: 개발 서버 실행 (http://localhost:3000)
- `build`: 프로덕션 빌드
- `start`: 프로덕션 서버 실행
- `lint`: ESLint로 코드 검사
- `type-check`: TypeScript 타입 체크
- `test`: Jest 테스트 실행
- `format`: Prettier로 코드 포맷팅
- `clean`: 빌드 파일 및 node_modules 정리

## 환경 설정

Node.js 버전 관리를 위해 `.nvmrc` 파일을 사용합니다:

```bash
nvm use
```

## 배포

이 프로젝트는 Vercel, Netlify 등의 플랫폼에 쉽게 배포할 수 있습니다.

### Vercel 배포

```bash
npm install -g vercel
vercel
```

## 기여하기

1. 이 저장소를 포크합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.
