# 🧪 테스트 가이드 - 사이드프로젝트용

> **목표**: 테스트를 처음 도입하는 팀을 위한 간단한 가이드

## 🚀 빠른 시작

### 1. 테스트 실행

```bash
npm test
```

### 2. 테스트 파일 만들기

```bash
# 컴포넌트와 같은 폴더에 만들기
src/components/Button.tsx
src/components/Button.test.tsx  # 이렇게!
```

### 3. 간단한 테스트 작성

```tsx
// Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

it('사용자가 버튼을 볼 수 있다', () => {
  render(<Button>클릭하세요</Button>);
  expect(screen.getByText('클릭하세요')).toBeInTheDocument();
});
```

## 테스트 작성 규칙

- **파일명**: `컴포넌트명.test.tsx`
- **위치**: 테스트할 파일과 같은 폴더
- **설명**: 한국어로 명확하게

### 📁 **테스트 파일 구조**

```tsx
// Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button 컴포넌트', () => {
  it('사용자가 버튼을 볼 수 있다', () => {
    // 테스트 코드
  });

  it('사용자가 버튼을 클릭할 수 있다', () => {
    // 테스트 코드
  });
});
```

### 🔧 **자주 사용하는 도구들**

- **`describe`**: 관련된 테스트들을 그룹화
- **`it`**: 개별 테스트 작성
- **`jest.fn()`**: 가짜 함수 만들기 (Mock)
- **`beforeEach`**: 각 테스트 전에 실행할 코드

### 🎯 **expect 매처들 (자주 사용)**

```tsx
// 기본 매처들
expect(element).toBeInTheDocument(); // 화면에 있는지
expect(element).toHaveTextContent('텍스트'); // 텍스트 내용
expect(element).toHaveClass('클래스명'); // CSS 클래스
expect(element).toBeDisabled(); // 비활성화 상태
expect(input).toHaveValue('값'); // 입력값

// 함수 호출 확인
expect(mockFn).toHaveBeenCalled(); // 호출되었는지
expect(mockFn).toHaveBeenCalledTimes(1); // 호출 횟수
expect(mockFn).toHaveBeenCalledWith('인자'); // 호출 인자
```

### 🔍 **screen 쿼리들**

```tsx
// 가장 많이 사용하는 쿼리들
screen.getByText('텍스트'); // 텍스트로 찾기
screen.getByRole('button'); // 역할로 찾기
screen.getByPlaceholderText('플레이스홀더'); // 플레이스홀더로 찾기
screen.getByTestId('test-id'); // 테스트 ID로 찾기

// 비동기 요소 찾기
await screen.findByText('텍스트'); // 나타날 때까지 기다림
```

```tsx
// 예시
it('사용자가 버튼을 클릭하면 onClick이 호출된다', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>클릭</Button>);

  fireEvent.click(screen.getByText('클릭'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

```tsx
// ❌ 나쁜 예시
test('test', () => {
  // 설명이 불명확
});

test('Button works', () => {
  // 영어와 한국어 혼재
});
```

## 🎯 자주 사용하는 테스트 패턴

> **참고**: 아래 예시들은 모두 **단위테스트**입니다. 하나의 컴포넌트만 테스트하여 빠르고 간단합니다.

### 1. 사용자가 화면을 볼 수 있는지 테스트

```tsx
it('사용자가 로그인 폼을 볼 수 있다', () => {
  render(<LoginForm />);
  expect(screen.getByText('로그인')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('이메일')).toBeInTheDocument();
});
```

### 2. 사용자가 버튼을 클릭할 수 있는지 테스트

```tsx
it('사용자가 로그인 버튼을 클릭할 수 있다', () => {
  const mockLogin = jest.fn();
  render(<LoginForm onLogin={mockLogin} />);

  fireEvent.click(screen.getByText('로그인'));
  expect(mockLogin).toHaveBeenCalledTimes(1);
});
```

### 3. 사용자가 입력할 수 있는지 테스트

```tsx
it('사용자가 이메일을 입력할 수 있다', () => {
  render(<LoginForm />);

  const emailInput = screen.getByPlaceholderText('이메일');
  fireEvent.change(emailInput, { target: { value: 'user@example.com' } });

  expect(emailInput.value).toBe('user@example.com');
});
```

### 4. beforeEach 사용 예시

```tsx
describe('LoginForm 컴포넌트', () => {
  let mockLogin: jest.Mock;

  beforeEach(() => {
    // 각 테스트 전에 실행
    mockLogin = jest.fn();
  });

  it('사용자가 로그인 버튼을 클릭할 수 있다', () => {
    render(<LoginForm onLogin={mockLogin} />);

    fireEvent.click(screen.getByText('로그인'));
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });

  it('사용자가 잘못된 정보로 로그인할 수 없다', () => {
    render(<LoginForm onLogin={mockLogin} />);

    // 잘못된 정보 입력 후 로그인 시도
    // 에러 메시지 확인
  });
});
```

### 5. fireEvent vs userEvent

```tsx
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// fireEvent - 기본적인 이벤트
it('fireEvent로 클릭 테스트', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>클릭</Button>);

  fireEvent.click(screen.getByText('클릭'));
  expect(handleClick).toHaveBeenCalled();
});

// userEvent - 더 현실적인 사용자 행동 (권장)
it('userEvent로 클릭 테스트', async () => {
  const user = userEvent.setup();
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>클릭</Button>);

  await user.click(screen.getByText('클릭'));
  expect(handleClick).toHaveBeenCalled();
});
```

### 6. 에러 처리 테스트

```tsx
it('사용자가 에러 메시지를 볼 수 있다', () => {
  render(<LoginForm hasError={true} errorMessage="로그인 실패" />);

  expect(screen.getByText('로그인 실패')).toBeInTheDocument();
  expect(screen.getByText('로그인 실패')).toHaveClass('error');
});

it('사용자가 비활성화된 버튼을 클릭할 수 없다', () => {
  render(<Button disabled>비활성화</Button>);

  const button = screen.getByRole('button');
  expect(button).toBeDisabled();
});
```

## 🔧 유용한 명령어

```bash
# 모든 테스트 실행
npm test

# 파일 변경 감지하며 테스트 실행
npm run test:watch

# 테스트 커버리지 확인
npm run test:coverage
```

## 💡 팁

1. **작게 시작하세요**: 복잡한 테스트보다는 간단한 것부터
2. **단위테스트부터**: 하나의 컴포넌트씩 테스트하기
3. **실패하는 테스트를 두려워하지 마세요**: 실패는 학습의 기회
4. **팀원과 소통하세요**: 테스트 작성 중 막히면 질문하기

### 📈 **테스트 단계별 도입**

1. **1단계**: 단위테스트 (현재 가이드)
2. **2단계**: 통합테스트 (여러 컴포넌트 조합)
3. **3단계**: E2E 테스트 (전체 사용자 플로우)

## 🆘 문제 해결

### 테스트가 실행되지 않을 때

```bash
# Node.js 버전 확인 (20 이상 필요)
node --version

# 올바른 버전으로 변경
npm run setup
```

### import 에러가 날 때

- 파일 경로 확인
- `@/` 경로가 올바른지 확인

### userEvent 사용 시 에러가 날 때

```bash
# userEvent 패키지 설치
npm install -D @testing-library/user-event
```

---
