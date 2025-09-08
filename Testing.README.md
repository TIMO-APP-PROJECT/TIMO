# 테스트 빠른 시작 가이드

> **목표**: 테스트를 처음 도입하는 팀을 위한 초간단 가이드

## 3단계로 시작하기

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

## 기본 패턴 3가지

### 1. 화면 확인

```tsx
it('사용자가 텍스트를 볼 수 있다', () => {
  render(<MyComponent />);
  expect(screen.getByText('예상 텍스트')).toBeInTheDocument();
});
```

### 2. 클릭 테스트

```tsx
it('사용자가 버튼을 클릭할 수 있다', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>클릭</Button>);

  fireEvent.click(screen.getByText('클릭'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### 3. 입력 테스트

```tsx
it('사용자가 입력할 수 있다', () => {
  render(<Input placeholder="이름" />);

  const input = screen.getByPlaceholderText('이름');
  fireEvent.change(input, { target: { value: '홍길동' } });

  expect(input.value).toBe('홍길동');
});
```

## 자주 사용하는 것들

### 기본 도구

- **`it`**: 테스트 작성
- **`describe`**: 테스트 그룹화
- **`jest.fn()`**: 가짜 함수 만들기
- **`render`**: 컴포넌트 렌더링
- **`screen`**: 화면에서 요소 찾기

### 자주 사용하는 매처

- `toBeInTheDocument()` - 화면에 있는지
- `toHaveBeenCalled()` - 함수가 호출되었는지
- `toHaveValue()` - 입력값 확인

### 자주 사용하는 쿼리

- `getByText('텍스트')` - 텍스트로 찾기
- `getByRole('button')` - 역할로 찾기
- `getByPlaceholderText('플레이스홀더')` - 플레이스홀더로 찾기

## 팁

1. **작게 시작**: 하나의 컴포넌트씩 테스트
2. **사용자 관점**: "사용자가 무엇을 할 수 있는가?"
3. **실패해도 OK**: 실패는 학습의 기회

## 문제 해결

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

---
