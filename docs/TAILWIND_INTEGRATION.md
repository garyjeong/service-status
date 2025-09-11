# Tailwind CSS 통합 가이드

## 개요

이 프로젝트는 CSS 변수와 Tailwind CSS가 완전히 통합된 색상 시스템을 사용합니다. 이 문서는 개발자가 일관되고 타입 안전한 스타일링을 구현할 수 있도록 도와줍니다.

## 색상 시스템

### 1. 상태 색상 (Status Colors)

```typescript
import { getStatusStyles } from '../utils/tailwind';

// 사용 예시
const styles = getStatusStyles('operational');
// 결과: { text: 'text-status-operational', bg: 'bg-status-operational/10', ... }
```

**사용 가능한 상태:**

- `operational` - 정상 작동
- `degraded` - 성능 저하
- `partial` - 부분 장애
- `outage` - 완전 장애
- `maintenance` - 점검 중
- `unknown` - 알 수 없음

### 2. 브랜드 색상 (Brand Colors)

```html
<!-- 민트 색상 -->
<div class="bg-brand-mint-primary text-white">메인 버튼</div>
<div class="bg-brand-mint-light text-brand-black-primary">연한 배경</div>

<!-- 성공 색상 -->
<div class="text-brand-green-success">성공 메시지</div>
```

### 3. 배경 색상 (Background Colors)

```html
<!-- 배경 색상 시스템 -->
<div class="bg-bg-primary">메인 배경</div>
<div class="bg-bg-secondary">카드 배경</div>
<div class="bg-bg-tertiary">네비게이션</div>
<div class="bg-bg-accent">액센트 영역</div>
```

## 컴포넌트 시스템

### 1. StatusBadge 컴포넌트

```tsx
import StatusBadge from '../components/ui/StatusBadge';

// 배지 형태
<StatusBadge status="operational">정상</StatusBadge>

// 점 + 텍스트 형태
<StatusBadge status="degraded" variant="dot">성능 저하</StatusBadge>

// 텍스트만
<StatusBadge status="outage" variant="text">장애</StatusBadge>
```

### 2. Button 컴포넌트

```tsx
import Button from '../components/ui/Button';

// 기본 버튼
<Button variant="primary" size="md">저장</Button>

// 보조 버튼
<Button variant="secondary" size="sm">취소</Button>

// 아이콘 버튼
<Button variant="icon" size="sm">
  <RefreshIcon />
</Button>
```

## 유틸리티 함수

### 1. 클래스명 조합

```typescript
import { cn } from '../utils/tailwind';

const className = cn('base-class', condition && 'conditional-class', 'another-class');
```

### 2. 반응형 클래스

```typescript
import { responsiveClass } from '../utils/tailwind';

const gridClass = responsiveClass(
  'grid grid-cols-1', // 기본 (모바일)
  'grid-cols-2', // sm 이상
  'grid-cols-2', // md 이상
  'grid-cols-3', // lg 이상
  'grid-cols-4' // xl 이상
);
```

### 3. 서비스 카드 스타일

```typescript
import { getServiceCardStyles } from '../utils/tailwind';

const cardStyles = getServiceCardStyles('operational', true);
// cardStyles.container - 카드 컨테이너 클래스
// cardStyles.status.text - 상태 텍스트 클래스
// cardStyles.status.dot - 상태 점 클래스
// cardStyles.status.badge - 상태 배지 클래스
```

## 반응형 디자인

### 브레이크포인트

```typescript
// Tailwind 설정과 동일한 브레이크포인트
const breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px', // 태블릿 이상
  lg: '1024px', // 데스크톱
  xl: '1280px',
  '2xl': '1536px',
};
```

### 반응형 유틸리티

```html
<!-- 모바일에서 숨김, 태블릿 이상에서 표시 -->
<div class="hidden md:block">데스크톱 컨텐츠</div>

<!-- 모바일에서만 표시 -->
<div class="block md:hidden">모바일 컨텐츠</div>

<!-- 반응형 패딩 -->
<div class="px-4 md:px-6 lg:px-8">컨테이너</div>

<!-- 반응형 그리드 -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">그리드 아이템들</div>
```

## CSS 변수 직접 사용

필요한 경우 CSS 변수를 직접 사용할 수 있습니다:

```css
.custom-element {
  background: rgb(var(--status-operational));
  border: 1px solid rgb(var(--border));
  color: rgb(var(--foreground));
}
```

## 그림자 시스템

```html
<!-- 서비스 카드 그림자 -->
<div class="shadow-service-card hover:shadow-service-card-hover">카드 컨텐츠</div>

<!-- 확장된 카드 그림자 -->
<div class="shadow-service-card-expanded">확장된 카드</div>

<!-- 즐겨찾기 글로우 효과 -->
<div class="shadow-favorite-glow">즐겨찾기 카드</div>
```

## 마이그레이션 가이드

### 기존 CSS 클래스에서 Tailwind로

```html
<!-- 기존 -->
<div class="service-card">...</div>

<!-- 새로운 방식 -->
<div class="bg-card border rounded-lg p-6 shadow-service-card hover:shadow-service-card-hover">
  ...
</div>
```

### 상태 색상 마이그레이션

```html
<!-- 기존 -->
<div class="status-operational">정상</div>

<!-- 새로운 방식 -->
<StatusBadge status="operational">정상</StatusBadge>

<!-- 또는 직접 클래스 사용 -->
<div class="text-status-operational">정상</div>
```

## 타입 안전성

모든 색상과 스타일 유틸리티는 TypeScript로 타입이 정의되어 있어 자동완성과 타입 검사를 지원합니다:

```typescript
// ✅ 올바른 사용
const status: StatusColor = 'operational';

// ❌ 컴파일 오류
const status: StatusColor = 'invalid-status';
```

## 성능 최적화

1. **Tree Shaking**: 사용하지 않는 Tailwind 클래스는 자동으로 제거됩니다.
2. **CSS 변수**: 런타임에 테마 변경 가능합니다.
3. **Utility-First**: 중복 CSS 생성을 방지합니다.

## 추가 리소스

- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [프로젝트 색상 시스템](/src/types/colors.ts)
- [유틸리티 함수](/src/utils/tailwind.ts)
- [반응형 훅](/src/hooks/useResponsive.ts)
