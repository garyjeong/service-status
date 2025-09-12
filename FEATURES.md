# 🚀 Service Status Dashboard - 기능 상세 가이드

## 📖 개요

Service Status Dashboard v3.1.0의 모든 기능을 상세히 설명하는 가이드입니다.

---

## 🎯 빠른 필터 시스템 (v3.1.0 NEW!)

### 🚨 "문제 있는 서비스만 보기" 필터

#### 기능 설명
- **원클릭 필터링**: 한 번의 클릭으로 문제가 있는 서비스만 표시
- **대상 상태**: `degraded`, `outage`, `major_outage` 상태인 서비스
- **장애 대응**: 인시던트 발생 시 즉시 문제 서비스 식별 가능

#### 사용법
```
데스크톱: 🚨 "문제만" 버튼 클릭
모바일: 🚨 아이콘 버튼 터치
키보드: 현재 단축키 없음 (F키로 필터 모달 이용)
```

#### 시각적 피드백
- **비활성화**: 일반 버튼 스타일
- **활성화**: 빨간색 배경 + 빨간색 테두리 + 빨간색 텍스트

#### 기술적 구현
```typescript
// Zustand 스토어 상태
quickFilters: {
  showOnlyProblematic: boolean;
  showOnlyFavorites: boolean;
}

// 필터링 로직 (dashboardStore.ts)
if (state.quickFilters.showOnlyProblematic) {
  filteredServices = filteredServices.filter(service => 
    service.status === 'degraded' || 
    service.status === 'outage' || 
    service.status === 'major_outage'
  );
}
```

### ❤️ "즐겨찾기만 보기" 필터

#### 기능 설명
- **개인화된 뷰**: 즐겨찾기로 설정한 서비스만 표시
- **즐겨찾기 조건**: 해당 서비스에 즐겨찾기된 컴포넌트가 하나라도 있으면 표시
- **빠른 모니터링**: 자주 사용하는 서비스만 빠르게 확인

#### 사용법
```
데스크톱: ❤️ "즐겨찾기만" 버튼 클릭
모바일: ❤️ 아이콘 버튼 터치
키보드: 현재 단축키 없음 (F키로 필터 모달 이용)
```

#### 시각적 피드백
- **비활성화**: 일반 버튼 스타일
- **활성화**: 노란색 배경 + 노란색 테두리 + 노란색 텍스트

#### 기술적 구현
```typescript
// 필터링 로직 (dashboardStore.ts)
if (state.quickFilters.showOnlyFavorites) {
  filteredServices = filteredServices.filter(service => {
    return service.components.some(component => 
      state.favorites[service.service_name]?.[component.name]
    );
  });
}
```

### 🔄 필터 조합 로직

#### AND 조건 동작
- **컴포넌트 필터 + 빠른 필터**: 모든 조건을 만족하는 서비스만 표시
- **두 빠른 필터 동시 활성화**: 문제가 있으면서 동시에 즐겨찾기인 서비스만 표시

#### 예시 시나리오
```
전체 30개 서비스 중:
- 컴포넌트 필터링 결과: 20개 서비스
- "문제만" 필터 활성화: 20개 중 문제 있는 2개만 표시
- "즐겨찾기만" 추가 활성화: 2개 중 즐겨찾기인 1개만 표시
```

---

## ⌨️ 키보드 단축키 시스템 (v3.1.0 NEW!)

### 🎯 지원 단축키

| 키 | 기능 | 설명 |
|---|---|---|
| **R** | 전체 새로고침 | 모든 서비스 상태를 다시 불러옴 |
| **F** | 필터 토글 | 필터 모달 열기/닫기 |
| **Esc** | 모달 닫기 | 모든 모달 및 드롭다운 닫기 |

### 🛡️ 스마트 비활성화

#### 비활성화 조건
단축키가 비활성화되는 상황:
- `<input>` 필드에 포커스
- `<textarea>` 필드에 포커스  
- `contenteditable="true"` 요소에 포커스

#### 구현 로직
```typescript
const isInputFocused = activeElement && (
  activeElement.tagName === 'INPUT' ||
  activeElement.tagName === 'TEXTAREA' ||
  activeElement.getAttribute('contenteditable') === 'true'
);

if (isInputFocused) return; // 단축키 비활성화
```

### 🚫 충돌 방지

#### 브라우저 기본 단축키 보호
- **Ctrl+R / Cmd+R**: 브라우저 새로고침 기본 동작 유지
- **Ctrl+F / Cmd+F**: 브라우저 검색 기본 동작 유지

#### 구현 로직
```typescript
case 'r':
  // Ctrl+R이나 Cmd+R (브라우저 새로고침)은 기본 동작 유지
  if (event.ctrlKey || event.metaKey) return;
  
  event.preventDefault();
  if (!isGlobalRefreshing) {
    refreshFilteredServices();
  }
  break;
```

### 📱 사용자 안내

#### 푸터 안내 메시지
- **데스크톱**: "⌨️ 키보드 단축키: R(새로고침), F(필터), Esc(닫기)"
- **모바일**: 공간 절약을 위해 숨김 (CSS `hidden md:inline`)

#### 다국어 지원
```json
// ko/dashboard.json
"keyboardShortcuts": "키보드 단축키: R(새로고침), F(필터), Esc(닫기)"

// en/dashboard.json  
"keyboardShortcuts": "Keyboard Shortcuts: R(Refresh), F(Filter), Esc(Close)"
```

---

## 📱 모바일 스크롤 최적화 (v3.1.0 NEW!)

### 🎯 네이티브 스크롤 지원

#### iOS Safari 최적화
```css
.modal-body {
  /* 모바일 터치 스크롤 개선 */
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}
```

- **-webkit-overflow-scrolling: touch**: iOS Safari에서 네이티브 모멘텀 스크롤 활성화
- **overscroll-behavior: contain**: 스크롤 체인 방지로 부모 요소 스크롤 간섭 차단

#### 터치 최적화
```css
.modal-content {
  /* 모바일 터치 최적화 */
  touch-action: pan-y;
}
```

- **touch-action: pan-y**: 세로 스크롤만 허용하여 터치 제스처 최적화

### 🎨 시각적 스크롤 인디케이터

#### 동적 그라데이션 표시
- **상단 그라데이션**: 위로 더 스크롤할 내용이 있을 때 표시
- **하단 그라데이션**: 아래로 더 스크롤할 내용이 있을 때 표시

#### 실시간 상태 감지
```typescript
const updateScrollState = () => {
  const { scrollTop, scrollHeight, clientHeight } = element;
  setCanScrollUp(scrollTop > 10);
  setCanScrollDown(scrollTop < scrollHeight - clientHeight - 10);
};
```

#### 그라데이션 스타일
```jsx
{/* 상단 스크롤 표시 그라데이션 */}
{canScrollUp && (
  <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[var(--bg-secondary)] to-transparent pointer-events-none z-10" />
)}

{/* 하단 스크롤 표시 그라데이션 */}
{canScrollDown && (
  <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent pointer-events-none z-10" />
)}
```

### 📏 모바일 최적화 레이아웃

#### 뷰포트 적응
```css
@media (max-width: 768px) {
  .modal-content {
    max-height: 85vh;
    min-height: 60vh;
    border-radius: 1.5rem 1.5rem 0 0;
  }
  
  .modal-body {
    max-height: calc(85vh - 100px);
  }
}
```

#### 스크롤바 스타일링
```css
/* 웹킷 기반 브라우저용 */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: rgba(var(--primary), 0.3);
  border-radius: 3px;
}

/* Firefox용 */
.modal-body {
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--primary), 0.3) transparent;
}
```

---

## ⚡ 이미지 성능 최적화 (v3.1.0 NEW!)

### 🖼️ Lazy Loading 구현

#### HTML 속성 활용
```jsx
<img 
  src={iconSrc} 
  alt={`${iconName} icon`} 
  loading="lazy"
  decoding="async"
  style={{ width: `${size}px`, height: `${size}px` }}
/>
```

- **loading="lazy"**: 뷰포트에 들어올 때만 이미지 로드
- **decoding="async"**: 비동기 디코딩으로 메인 스레드 블로킹 방지

#### 적용 범위
- **ServiceCard**: 메인 서비스 카드의 아이콘
- **FilterModal**: 필터 모달의 서비스 아이콘
- **모든 ServiceIcon 컴포넌트**: 재사용 컴포넌트 전체 적용

### 🚀 Critical 이미지 Preload

#### HTML Head에서 우선 로드
```html
<!-- Preload critical service icons for better performance -->
<link rel="preload" href="/src/assets/gpt.png" as="image" />
<link rel="preload" href="/src/assets/claude.png" as="image" />
<link rel="preload" href="/src/assets/github.png" as="image" />
<link rel="preload" href="/src/assets/aws.png" as="image" />
<link rel="preload" href="/src/assets/slack.png" as="image" />
<link rel="preload" href="/src/assets/firebase.png" as="image" />
```

#### 선정 기준
주요 6개 서비스 아이콘을 preload:
- **OpenAI (GPT)**: AI 서비스 대표
- **Claude**: AI 서비스 주요 경쟁자
- **GitHub**: 개발자 필수 서비스
- **AWS**: 클라우드 서비스 대표
- **Slack**: 커뮤니케이션 도구 대표
- **Firebase**: 백엔드 서비스 대표

### 📊 성능 개선 효과

#### 로딩 시간 개선
- **초기 페이지**: Critical 이미지만 우선 로드로 체감 속도 향상
- **스크롤 시**: 필요한 순간에 이미지 로드로 부드러운 경험
- **대역폭**: 사용자가 보지 않는 이미지는 로드하지 않아 절약

#### 브라우저 호환성
- **Modern Browsers**: `loading="lazy"` 네이티브 지원
- **Legacy Browsers**: 속성 무시하고 일반 로딩 (Graceful Degradation)

---

## 🛠️ 에러 처리 및 안정성 개선 (v3.1.0)

### 🔄 재시도 메커니즘

#### 지수 백오프 재시도
```typescript
const DEFAULT_RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1초
  timeoutMultiplier: 1.5 // 1초 → 1.5초 → 2.25초
};
```

#### 스마트 재시도 로직
```typescript
// 4xx 에러는 재시도하지 않음 (클라이언트 오류)
// 5xx, 네트워크, 타임아웃 에러만 재시도
static shouldRetry(error: any): boolean {
  const errorType = this.getErrorType(error);
  return errorType !== 'client';
}
```

### 🎯 사용자 친화적 에러 메시지

#### ErrorHandler 클래스
```typescript
export class ErrorHandler {
  static getUserFriendlyMessage(error: any, serviceName: string): string {
    const errorType = this.getErrorType(error);
    
    switch (errorType) {
      case 'network':
        return `${serviceName} 서비스에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.`;
      case 'timeout':
        return `${serviceName} 서비스 응답시간이 초과되었습니다. 잠시 후 다시 시도해주세요.`;
      case 'server':
        return `${serviceName} 서비스에서 일시적인 문제가 발생했습니다. (${error?.response?.status})`;
      case 'client':
        return `${serviceName} 서비스 요청에 문제가 있습니다. (${error?.response?.status})`;
      default:
        return `${serviceName} 서비스 상태를 가져올 수 없습니다.`;
    }
  }
}
```

#### 에러 분류 시스템
- **network**: 네트워크 연결 문제
- **timeout**: 응답 시간 초과
- **server**: 5xx 서버 오류
- **client**: 4xx 클라이언트 오류
- **unknown**: 기타 예상치 못한 오류

### 🚫 중복 요청 방지

#### 서비스별 요청 추적
```typescript
// 중복 요청 방지를 위한 상태
const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());
const [isGlobalRefreshing, setIsGlobalRefreshing] = useState<boolean>(false);

// 중복 요청 체크
if (pendingRequests.has(serviceKey)) {
  console.warn(`${serviceKey} 서비스는 이미 로딩 중입니다.`);
  return;
}
```

#### 전역 새로고침 제어
```typescript
// 전체 새로고침 중복 방지
if (isGlobalRefreshing) {
  console.warn('전체 새로고침이 이미 진행 중입니다.');
  return;
}
```

---

## 🎯 상태 관리 개선 (v3.1.0)

### 🏪 Zustand 스토어 확장

#### 새로운 상태 추가
```typescript
interface DashboardState {
  // 기존 상태...
  
  // 빠른 필터 (NEW!)
  quickFilters: {
    showOnlyProblematic: boolean;
    showOnlyFavorites: boolean;
  };
  
  // 서비스별 에러 관리 (NEW!)
  serviceErrors: { [serviceName: string]: string | null };
}
```

#### 새로운 액션 추가
```typescript
interface DashboardActions {
  // 기존 액션...
  
  // 빠른 필터 관련 (NEW!)
  toggleQuickFilter: (filterType: 'showOnlyProblematic' | 'showOnlyFavorites') => void;
  
  // 에러 관리 (NEW!)
  setServiceError: (serviceName: string, error: string | null) => void;
}
```

### 🔄 필터링 로직 통합

#### getFilteredServices 확장
```typescript
getFilteredServices: () => {
  const state = get();
  let filteredServices = state.services.filter(/* 기존 컴포넌트 필터 */);

  // 빠른 필터 적용 (NEW!)
  if (state.quickFilters.showOnlyProblematic) {
    filteredServices = filteredServices.filter(service => 
      service.status === 'degraded' || 
      service.status === 'outage' || 
      service.status === 'major_outage'
    );
  }

  if (state.quickFilters.showOnlyFavorites) {
    filteredServices = filteredServices.filter(service => {
      return service.components.some(component => 
        state.favorites[service.service_name]?.[component.name]
      );
    });
  }

  return filteredServices;
}
```

---

## 🎨 UI/UX 개선 사항

### 🎯 반응형 디자인 강화

#### 빠른 필터 버튼 반응형
```jsx
{/* 데스크톱: 아이콘 + 텍스트 */}
<span className="hidden xl:inline">{translations.showOnlyProblematic}</span>

{/* 모바일: 아이콘만 */}
<AlertTriangle className="w-4 h-4" />
```

#### 키보드 단축키 안내
```jsx
{/* 데스크톱에서만 표시 */}
<span className="hidden md:inline text-xs text-muted-foreground">
  ⌨️ {t('keyboardShortcuts')}
</span>
```

### 🎨 시각적 피드백 개선

#### 활성 상태 표시
```css
/* 활성화된 빠른 필터 버튼 */
.quick-filter-active-problematic {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
  color: rgb(252, 165, 165);
}

.quick-filter-active-favorites {
  background: rgba(245, 158, 11, 0.2);
  border-color: rgba(245, 158, 11, 0.4);
  color: rgb(252, 211, 77);
}
```

#### 호버 효과 유지
모든 기존 hover 효과와 애니메이션이 새로운 기능에서도 일관성 있게 적용됩니다.

---

## 📊 성과 및 지표

### 🎯 사용자 경험 개선

#### 장애 대응 효율성
- **이전**: 전체 서비스 중에서 문제 서비스 찾기
- **개선 후**: "문제만" 버튼으로 즉시 식별
- **효과**: 장애 대응 시간 80% 단축 (추정)

#### 파워 유저 지원
- **이전**: 마우스로만 조작 가능
- **개선 후**: 키보드만으로 모든 주요 기능 접근
- **효과**: 개발자 워크플로우에 자연스럽게 통합

#### 모바일 경험
- **이전**: 모바일 스크롤시 끊김 현상
- **개선 후**: iOS Safari 네이티브 스크롤 + 시각적 인디케이터
- **효과**: 모바일 사용성 대폭 개선

### ⚡ 성능 개선

#### 초기 로딩
- **이전**: 모든 이미지 동시 로드
- **개선 후**: Critical 이미지 preload + lazy loading
- **효과**: 초기 로딩 시간 30% 개선 (추정)

#### 네트워크 사용량
- **이전**: 필요없는 이미지도 로드
- **개선 후**: 뷰포트 진입시에만 로드
- **효과**: 데이터 사용량 50% 절약 (추정)

### 🛠️ 개발자 경험

#### 코드 품질
- **중복 코드 제거**: ServiceIcon 컴포넌트 통합
- **타입 안전성**: 모든 새로운 기능에 TypeScript 적용
- **유지보수성**: 모듈화된 구조로 기능별 분리

#### 확장성
- **새로운 필터 추가**: quickFilters 객체에 추가만 하면 됨
- **새로운 단축키**: 기존 switch문에 case 추가만 하면 됨
- **새로운 에러 타입**: ErrorHandler 클래스에 추가 가능

---

## 🔄 향후 개선 계획

### 🎯 단기 계획 (다음 버전)
- **스켈레톤 로딩**: 더 부드러운 로딩 애니메이션
- **터치 제스처**: 스와이프로 새로고침 기능
- **추가 단축키**: 숫자키로 빠른 필터 전환

### 🚀 중기 계획 (향후 2-3개월)
- **커스텀 필터**: 사용자 정의 필터 생성
- **대시보드 레이아웃**: 드래그앤드롭으로 순서 변경
- **PWA 기능**: 오프라인 지원 및 앱 설치

### 🌟 장기 비전 (향후 6개월)
- **실시간 알림**: WebSocket 기반 실시간 상태 변경 알림
- **히스토리 기능**: 서비스 상태 변경 이력 및 통계
- **API 제공**: 외부에서 사용할 수 있는 REST API

---

*이 문서는 Service Status Dashboard v3.1.0 기준으로 작성되었습니다.*  
*최종 업데이트: 2025년 1월 12일*
