# TIMO

iOS 앱과 웹을 함께 개발하는 모노레포 프로젝트입니다.

## 프로젝트 구조

```
TIMO/
├── apps/
│   ├── mobile/          # React Native Expo 앱 (iOS 전용)
│   └── web/             # Next.js 웹 애플리케이션
├── packages/
│   ├── shared/          # 공유 로직 및 상태관리
│   └── ui/              # 공유 UI 컴포넌트
└── tools/               # 개발 도구 및 설정
```

## 기술 스택

### 모바일 앱 (iOS)

- React Native
- Expo
- TypeScript
- WebView (react-native-webview)

### 웹 애플리케이션

- Next.js 15
- TypeScript
- Tailwind CSS
- Storybook

### 공유

- Zustand (전역 상태관리)
- ESLint & Prettier
- Turbo (모노레포 빌드 시스템)

## 개발 환경 요구사항

- Node.js 20+
- npm 10+

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

#### 모바일 앱 (iOS)

```bash
npm run mobile
```

시뮬레이터에서 새로고침:

- CMD + R: 수동 새로고침
- CMD + D: 개발자 메뉴 열기

자동 새로고침이 동작하지 않을 경우:

1. CMD + D로 개발자 메뉴 열기
2. "Enable Fast Refresh" 활성화

#### 모바일 기기에서 Expo Go로 실행

1. Expo Go 앱 설치
   - iOS: App Store에서 'Expo Go' 설치
   - Android: Play Store에서 'Expo Go' 설치

2. 개발 서버 실행

3. QR 코드 스캔 혹은 폰에서 주소지 이동

#### 웹 애플리케이션

```bash
npm run web
```

#### Storybook

```bash
npm run storybook
```

### 3. 빌드

```bash
npm run build
```

### 4. 린팅 및 포맷팅

```bash
npm run lint
npm run format
```

## 워크스페이스

이 프로젝트는 npm workspaces를 사용하여 모노레포로 구성되어 있습니다.

- `@timo/mobile`: React Native Expo 앱
- `@timo/web`: Next.js 웹 앱
- `@timo/shared`: 공유 로직 및 타입
- `@timo/ui`: 공유 UI 컴포넌트

## 개발 가이드

### 새로운 컴포넌트 추가

1. `packages/ui/src/components/`에 컴포넌트 생성
2. `packages/ui/src/components/index.ts`에 export 추가
3. Storybook 스토리 작성 (선택사항)

### 상태 관리

- 전역 상태는 `packages/shared/src/stores/`에서 Zustand로 관리
- 앱과 웹에서 동일한 상태 로직 공유

### 스타일링

- 웹: Tailwind CSS 클래스 사용
- 모바일: React Native StyleSheet (필요시 NativeWind 고려)

## 배포

### iOS 앱

```bash
cd apps/mobile
npm run build:ios
```

### 웹 앱

```bash
cd apps/web
npm run build
```
