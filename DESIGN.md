# AI 서비스 상태 모니터링 대시보드 - 디자인 시스템

## 프로젝트 개요

AI 서비스 상태 모니터링 대시보드는 주요 AI 서비스들과 외부 서비스들의 실시간 상태를 모니터링하는 React + TypeScript 기반의 현대적인 웹 대시보드입니다.

### 핵심 기능
- **실시간 서비스 상태 모니터링** - 15초 간격 자동 업데이트
- **컴포넌트별 세부 상태 확인** - 각 서비스의 하위 컴포넌트 상태 표시
- **즐겨찾기 시스템** - 중요한 서비스 컴포넌트 즐겨찾기 및 보존
- **반응형 UI/UX** - 모바일/태블릿/데스크톱 최적화
- **다크 테마 전용** - 개발자 친화적 어두운 인터페이스
- **다국어 지원** - 한국어/영어 전환 가능
- **개별 서비스 새로고침** - 각 서비스별 독립적인 새로고침 기능
- **개선된 레이아웃** - 아이콘 상단 정렬, 상태 표시 최적화

## 기술 스택

### Frontend Framework
- **React 19.1.0** - 최신 함수형 컴포넌트와 Hooks 사용
- **TypeScript 5.8.3** - 엄격한 타입 안전성
- **Vite 6.3.5** - 최신 개발 서버와 HMR

### 스타일링
- **Tailwind CSS 4.1.10** - 최신 유틸리티 퍼스트 CSS 프레임워크
- **CSS Variables** - 다크 테마 색상 시스템
- **Lucide React** - 일관된 아이콘 시스템
- **반응형 디자인** - 모바일/태블릿/데스크톱 지원

### 상태 관리 & 데이터
- **TanStack Query 5.80.7** - 최신 서버 상태 관리 및 캐싱
- **Axios 1.10.0** - HTTP 클라이언트
- **Custom Hooks** - 비즈니스 로직 분리

### 패키지 관리
- **pnpm 8.10.0** - 효율적인 패키지 관리
- **Node.js 18+** - 최신 JavaScript 런타임

## 아키텍처 패턴

### 프로젝트 구조
```
src/
├── components/           # React 컴포넌트
│   └── Dashboard.tsx    # 메인 대시보드 (단일 컴포넌트)
├── hooks/               # 커스텀 React Hooks
│   └── useStatus.ts     # 상태 관리 훅 (TanStack Query 기반)
├── services/            # API 서비스 레이어
│   └── api.ts          # 외부 API 통신 로직
├── types/               # TypeScript 타입 정의
│   └── status.ts       # 상태 관련 타입 정의
├── utils/               # 유틸리티 함수
│   └── status.ts       # 상태 처리 및 변환 함수
├── assets/              # 정적 자산 (아이콘)
└── main.tsx            # 애플리케이션 진입점
```

### 아키텍처 원칙
- **컴포넌트 기반 설계** - 재사용 가능한 컴포넌트
- **관심사 분리** - 비즈니스 로직과 UI 로직 분리
- **타입 안전성** - 모든 데이터 구조 타입 정의
- **성능 최적화** - 메모이제이션과 지연 로딩

## 디자인 시스템

### 컬러 팔레트 (다크 테마 - CSS Variables 기반)

#### 배경색
```css
/* CSS Variables 정의 */
:root {
  --background: 222.2 84% 4.9%;           /* 메인 배경 (매우 어두운 회색) */
  --card: 222.2 84% 4.9%;                 /* 카드 배경 */
  --popover: 222.2 84% 4.9%;              /* 팝오버 배경 */
  --primary: 210 40% 98%;                 /* 주요 색상 (거의 흰색) */
  --secondary: 217.2 32.6% 17.5%;         /* 보조 색상 (어두운 회색) */
  --muted: 217.2 32.6% 17.5%;             /* 음소거된 색상 */
  --accent: 217.2 32.6% 17.5%;            /* 액센트 색상 */
  --destructive: 0 62.8% 30.6%;           /* 파괴적 액션 색상 (어두운 빨강) */
  --border: 217.2 32.6% 17.5%;            /* 테두리 색상 */
  --input: 217.2 32.6% 17.5%;             /* 입력 필드 색상 */
  --ring: 212.7 26.8% 83.9%;              /* 포커스 링 색상 */
}

/* 실제 사용 클래스 */
.bg-background { background-color: hsl(var(--background)); }
.bg-card { background-color: hsl(var(--card)); }
.bg-secondary { background-color: hsl(var(--secondary)); }
```

#### 텍스트 색상
```css
/* CSS Variables */
--foreground: 210 40% 98%;                /* 주요 텍스트 (거의 흰색) */
--card-foreground: 210 40% 98%;           /* 카드 텍스트 */
--popover-foreground: 210 40% 98%;        /* 팝오버 텍스트 */
--primary-foreground: 222.2 84% 4.9%;     /* 주요 색상 텍스트 */
--secondary-foreground: 210 40% 98%;       /* 보조 텍스트 */
--muted-foreground: 215 20.2% 65.1%;      /* 음소거된 텍스트 */
--accent-foreground: 210 40% 98%;          /* 액센트 텍스트 */
--destructive-foreground: 210 40% 98%;     /* 파괴적 액션 텍스트 */

/* 실제 사용 클래스 */
.text-foreground { color: hsl(var(--foreground)); }
.text-muted-foreground { color: hsl(var(--muted-foreground)); }
```

#### 상태 색상 (커스텀 CSS 클래스)
```css
/* 정상 운영 (Operational) */
.status-operational { 
  background-color: rgb(34, 197, 94);     /* green-500 */
  color: white;
}

/* 성능 저하 (Degraded) */
.status-degraded { 
  background-color: rgb(234, 179, 8);     /* yellow-500 */
  color: white;
}

/* 부분 장애 (Partial Outage) */
.status-partial-outage { 
  background-color: rgb(249, 115, 22);    /* orange-500 */
  color: white;
}

/* 주요 장애 (Major Outage) */
.status-major-outage { 
  background-color: rgb(239, 68, 68);     /* red-500 */
  color: white;
}

/* 유지보수 (Maintenance) */
.status-maintenance { 
  background-color: rgb(59, 130, 246);    /* blue-500 */
  color: white;
}

/* 알 수 없음 (Unknown) */
.status-unknown { 
  background-color: rgb(107, 114, 128);   /* gray-500 */
  color: white;
}
```

### 레이아웃 시스템

#### 페이지 구조
```css
/* 전체 페이지 레이아웃 */
.min-h-screen {
  min-height: 100vh;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

/* 컨테이너 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}
```

#### 헤더 영역
```css
/* 헤더 레이아웃 */
.header-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .header-section {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

/* 제목 영역 */
.title-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.main-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: hsl(var(--foreground));
}

/* 컨트롤 영역 */
.controls-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

@media (min-width: 768px) {
  .controls-section {
    flex-direction: row;
    width: auto;
  }
}
```

#### 푸터 영역
```css
/* 푸터 레이아웃 */
.footer-section {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
}

.footer-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .footer-info {
    flex-direction: row;
    gap: 1rem;
  }
}

.footer-separator {
  display: none;
}

@media (min-width: 640px) {
  .footer-separator {
    display: inline;
  }
}
```

#### 반응형 브레이크포인트
```css
/* Tailwind CSS 4.x 브레이크포인트 */
/* 모바일 */
default (< 640px)

/* 태블릿 */
sm (640px+)

/* 데스크톱 */
md (768px+)
lg (1024px+)
xl (1280px+)
2xl (1536px+)

/* 커스텀 */
xs (475px+) - 추가된 소형 화면 지원
```

#### 그리드 시스템
```css
/* 서비스 그리드 */
.services-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .services-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 필터 그리드 */
.filter-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .filter-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .filter-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 컴포넌트 디자인

#### 카드 시스템
```css
/* 기본 카드 스타일 */
.card-base {
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.card-base:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* 서비스 카드 */
.service-card {
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 1rem;
  padding: 1.5rem;
  transition: border-color 0.3s ease;
}

.service-card:hover {
  border-color: hsl(var(--accent));
}

/* 컴포넌트 카드 */
.component-card {
  background-color: hsl(var(--secondary));
  border-radius: 0.5rem;
  padding: 0.75rem;
  transition: background-color 0.3s ease;
}

.component-card:hover {
  background-color: hsl(var(--accent));
}
```

#### 버튼 시스템
```css
/* 주요 버튼 */
.btn-primary {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: hsl(var(--primary) / 0.9);
}

/* 보조 버튼 */
.btn-secondary {
  background-color: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  transition: background-color 0.3s ease;
}

.btn-secondary:hover {
  background-color: hsl(var(--secondary) / 0.8);
}

/* 아이콘 버튼 */
.btn-icon {
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: hsl(var(--muted-foreground));
  transition: all 0.3s ease;
}

.btn-icon:hover {
  background-color: hsl(var(--secondary));
  color: hsl(var(--foreground));
}

/* 포커스 링 */
.focus-ring:focus {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--ring));
}
```

#### 상태 인디케이터
```css
/* 상태 점 */
.status-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  flex-shrink: 0;
}

/* 상태 배지 */
.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}
```

### 고정 레이아웃 시스템

#### 헤더 고정 (Sticky Header)
```css
/* 고정 헤더 옵션 */
.header-sticky {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: rgb(var(--background) / 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgb(var(--border));
  padding: 1rem 0;
}

/* 헤더 고정 시 컨텐츠 여백 조정 */
.content-with-sticky-header {
  padding-top: 1rem;
}
```

#### 푸터 고정 (Sticky Footer)
```css
/* 고정 푸터 옵션 */
.layout-with-sticky-footer {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

.footer-sticky {
  position: sticky;
  bottom: 0;
  z-index: 40;
  background-color: rgb(var(--background) / 0.95);
  backdrop-filter: blur(8px);
  border-top: 1px solid rgb(var(--border));
  padding: 1rem 0;
  margin-top: auto;
}

/* 푸터 고정 시 컨텐츠 여백 조정 */
.content-with-sticky-footer {
  padding-bottom: 1rem;
}
```

#### 고정 레이아웃 활성화 클래스
```css
/* 헤더만 고정 */
.layout-sticky-header .header-section {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: rgb(var(--background) / 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgb(var(--border));
  padding: 1rem 0;
}

/* 푸터만 고정 */
.layout-sticky-footer {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-sticky-footer .main-content {
  flex: 1;
}

.layout-sticky-footer .footer-section {
  position: sticky;
  bottom: 0;
  z-index: 40;
  background-color: rgb(var(--background) / 0.95);
  backdrop-filter: blur(8px);
  border-top: 1px solid rgb(var(--border));
  padding: 1rem 0;
  margin-top: auto;
}

/* 헤더와 푸터 모두 고정 */
.layout-sticky-both {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-sticky-both .header-section {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: rgb(var(--background) / 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgb(var(--border));
  padding: 1rem 0;
}

.layout-sticky-both .main-content {
  flex: 1;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.layout-sticky-both .footer-section {
  position: sticky;
  bottom: 0;
  z-index: 40;
  background-color: rgb(var(--background) / 0.95);
  backdrop-filter: blur(8px);
  border-top: 1px solid rgb(var(--border));
  padding: 1rem 0;
  margin-top: auto;
}
```

#### 현재 구현 상태
- **헤더 고정**: `layout-sticky-both` 클래스로 활성화됨
- **푸터 고정**: `layout-sticky-both` 클래스로 활성화됨
- **상태 표시**: 모든 서비스와 컴포넌트에 초록색 상태 점 표시됨
- **반응형 지원**: 모든 화면 크기에서 고정 레이아웃 작동

### 타이포그래피

#### 폰트 패밀리
- **시스템 폰트**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **한국어 지원**: 시스템 기본 한국어 폰트 사용

#### 크기 체계
```css
/* 페이지 제목 */
.text-3xl { font-size: 1.875rem; font-weight: 700; }

/* 섹션 제목 */
.text-xl { font-size: 1.25rem; font-weight: 600; }

/* 서비스 이름 */
.text-lg { font-size: 1.125rem; font-weight: 500; }

/* 본문 텍스트 */
.text-base { font-size: 1rem; }

/* 작은 텍스트 */
.text-sm { font-size: 0.875rem; }

/* 매우 작은 텍스트 */
.text-xs { font-size: 0.75rem; }
```

### 상호작용 디자인

#### 애니메이션
```css
/* 전환 효과 */
.transition-all { transition: all 0.3s ease-in-out; }
.transition-colors { transition: color 0.3s ease, background-color 0.3s ease; }
.transition-shadow { transition: box-shadow 0.3s ease; }

/* 호버 효과 */
.hover-scale:hover { transform: scale(1.02); }

/* 로딩 애니메이션 */
.animate-spin { animation: spin 1s linear infinite; }

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

#### 접근성
```css
/* 키보드 네비게이션 */
.focus-ring:focus {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--ring));
}

/* 스크린 리더 전용 텍스트 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### 다국어 지원 (i18n)

#### 언어 전환 시스템
```typescript
// 언어 타입 정의
type Language = 'ko' | 'en';

// 번역 데이터 구조
interface Translations {
  ko: TranslationKeys;
  en: TranslationKeys;
}

interface TranslationKeys {
  title: string;
  refresh: string;
  filter: string;
  autoUpdate: string;
  monitoring: string;
  services: string;
  subtitle: string;
  services_desc: {
    [key: string]: string;
  };
}
```

#### 언어 선택 UI
```css
/* 언어 드롭다운 */
.language-dropdown {
  position: relative;
}

.language-dropdown-menu {
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  width: 10rem;
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.language-option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  text-align: left;
  transition: background-color 0.3s ease;
  font-size: 0.875rem;
}

.language-option:hover {
  background-color: hsl(var(--accent));
}

.language-option.active {
  background-color: hsl(var(--accent));
}
```

## 데이터 구조

### 서비스 상태 타입
```typescript
enum StatusType {
  OPERATIONAL = 'operational',
  DEGRADED_PERFORMANCE = 'degraded_performance', 
  PARTIAL_OUTAGE = 'partial_outage',
  MAJOR_OUTAGE = 'major_outage',
  UNDER_MAINTENANCE = 'under_maintenance',
  UNKNOWN = 'unknown'
}
```

### 핵심 인터페이스
```typescript
interface ServiceStatus {
  service_name: string;
  display_name: string;
  overall_status: StatusType;
  components: ComponentStatus[];
  description: string;
  page_url: string;
  updated_at: string;
  icon_url?: string;
}

interface ComponentStatus {
  id: string;
  name: string;
  status: StatusType;
  description?: string;
  updated_at?: string;
}
```

## 모니터링 대상 서비스

### AI 서비스
1. **OpenAI ChatGPT** - ChatGPT 웹, OpenAI API, DALL-E, Whisper, GPT-4/3.5
2. **Anthropic Claude** - Claude Chat, Anthropic API, Claude Pro, Claude-3 모델들
3. **Cursor Editor** - 데스크톱 앱, AI Copilot, 동기화, 확장기능
4. **Google AI Studio** - Gemini API, AI Studio, Model Garden, Vertex AI

### 외부 서비스
1. **GitHub** - Git 작업, API 요청, Issues/PRs, Actions, Pages
2. **Netlify** - CDN, 빌드, Edge Functions, Forms, DNS
3. **Docker Hub** - 레지스트리, 빌드 서비스, 웹훅
4. **AWS** - EC2, S3, RDS, Lambda, CloudFront, Route 53
5. **Slack** - 메시징, 알림, 앱, 통화, 워크플로우
6. **Firebase** - 호스팅, 데이터베이스, 인증, 함수, 스토리지

## 성능 및 최적화

### 렌더링 최적화
- **React.memo** - 불필요한 리렌더링 방지
- **useMemo/useCallback** - 계산 비용이 큰 연산 메모이제이션
- **지연 로딩** - 이미지와 컴포넌트 지연 로딩

### 네트워크 최적화
- **TanStack Query** - 자동 캐싱 및 백그라운드 업데이트
- **요청 중복 제거** - 동일한 API 요청 최적화
- **에러 재시도** - 실패한 요청 자동 재시도

### 번들 최적화
- **Tree Shaking** - 불필요한 코드 제거
- **Code Splitting** - 필요시 코드 로딩
- **이미지 최적화** - 적절한 형식과 크기 사용

## 개발 가이드라인

### 코드 스타일
- **ESLint 9 + Prettier 3.5** - 최신 코드 품질 및 포맷팅
- **TypeScript Strict Mode** - 엄격한 타입 검사
- **함수형 프로그래밍** - 순수 함수와 불변성

### 테스트 전략
- **Vitest 3.2** - 최신 단위 테스트 프레임워크
- **Testing Library** - React 컴포넌트 테스트
- **MSW** - API 모킹

### 빌드 및 배포
- **Vite Build** - 프로덕션 최적화 빌드
- **정적 호스팅** - Netlify, Vercel 등 지원
- **Docker 지원** - 컨테이너 배포 옵션

## 확장 가능성

### 향후 개선 사항
- **실시간 WebSocket** - 폴링 대신 실시간 업데이트
- **알림 시스템** - 서비스 장애 시 알림
- **대시보드 커스터마이징** - 사용자별 설정
- **PWA 기능** - 오프라인 지원과 설치 가능
- **헤더/푸터 고정 옵션** - 사용자 설정 가능한 고정 레이아웃

### 확장성 고려사항
- **마이크로프론트엔드** - 서비스별 독립 개발
- **상태 관리 확장** - Zustand, Redux Toolkit 등
- **모니터링 확장** - 더 많은 서비스 추가
- **사용자 인증** - 개인화 기능 추가

## 브랜딩

### 시각적 아이덴티티
- **어두운 테마** - 개발자 친화적 환경
- **최소주의 디자인** - 깔끔하고 명확한 인터페이스
- **정보 중심** - 데이터 가독성 우선
- **프로페셔널** - 엔터프라이즈 수준의 품질

### 사용자 경험
- **빠른 로딩** - 즉시 정보 확인 가능
- **직관적 네비게이션** - 클릭 없이 정보 파악
- **상태 명확성** - 한눈에 서비스 상태 파악
- **반응형 지원** - 모든 디바이스에서 최적 경험
- **다국어 지원** - 한국어/영어 실시간 전환

## 광고 통합 (Kakao AdFit)

### 광고 디자인 원칙
- **가이드라인 준수** - AdFit 스크립트 변형 금지
- **고정 크기** - 728x90 배너 고정 사이즈
- **최소 간섭** - 사용자 경험에 최소한의 영향
- **자연스러운 배치** - 콘텐츠 흐름에 맞는 위치

### AdFitBanner 컴포넌트

#### 컴포넌트 구조
```typescript
interface AdFitBannerProps {
  adUnit: string;      // 광고 단위 ID
  className?: string;  // 제한적 스타일링 (컨테이너만)
  onNoAd?: () => void; // NO-AD 콜백
}

// 사용 예시 (올바른 방법)
<AdFitBanner 
  adUnit="DAN-wiu4St0eJQqPsPgL"
  onNoAd={() => console.log('광고 로드 실패')}
/>
```

#### 스타일링 제한사항

##### ❌ 금지된 스타일 (AdFit 가이드라인 위반)
```css
/* 이런 스타일들은 심사 보류 원인 */
.adfit-banner {
  border-radius: 8px;        /* 둥근 모서리 */
  overflow: hidden;          /* 내용 자르기 */
  border: 1px solid #ccc;    /* 테두리 */
  background: rgba(0,0,0,0.1); /* 배경색 */
  backdrop-filter: blur(4px); /* 블러 효과 */
  transform: scale(1.1);      /* 변형 효과 */
  opacity: 0.9;              /* 투명도 */
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); /* 그림자 */
}
```

##### ✅ 허용된 스타일 (컨테이너 레이아웃만)
```css
/* 광고를 감싸는 컨테이너의 레이아웃 스타일만 허용 */
.ad-container {
  display: flex;
  justify-content: center;   /* 중앙 정렬 */
  margin: 1.5rem 0;         /* 여백 */
  padding: 0;               /* 패딩 (필요시) */
}

/* 광고 자체에는 아무 스타일도 적용하지 않음 */
.adfit-banner {
  /* 스타일 없음 - AdFit 스크립트 원본 그대로 */
}
```

#### 광고 배치 위치
```css
/* 상단 광고 - 헤더 바로 아래 */
.top-ad {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

/* 하단 광고 - 모든 콘텐츠 아래, 푸터 위 */
.bottom-ad {
  margin-top: 2rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}
```

#### 로딩 상태 처리
```css
/* 로딩 플레이스홀더 (AdFit 가이드라인 준수) */
.ad-loading-placeholder {
  width: 728px;
  height: 90px;
  background-color: rgba(255, 255, 255, 0.05);
  /* border-radius 제거 - 둥근 모서리 금지 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}
```

### 광고 통합 체크리스트

#### ✅ 심사 통과 요구사항
- [ ] 광고 스크립트 원본 유지 (변형 금지)
- [ ] 고정 크기 728x90 적용
- [ ] 둥근 모서리(border-radius) 제거
- [ ] 테두리(border) 제거  
- [ ] 배경색/효과 제거
- [ ] overflow: hidden 제거
- [ ] transform 효과 제거
- [ ] 투명도/필터 제거

#### ✅ 구현 완료 사항
- [x] AdFitBanner 컴포넌트 props에서 width/height 제거
- [x] className의 모든 스타일 제거
- [x] 로딩 플레이스홀더 border-radius 제거
- [x] Dashboard.tsx에서 광고 스타일링 완전 제거
- [x] 가이드라인 문서화 완료

### 성능 최적화
- **스크립트 중복 방지** - 이미 로드된 스크립트 재사용
- **비동기 로딩** - 페이지 로딩 속도에 영향 없음
- **메모리 관리** - 컴포넌트 언마운트 시 콜백 정리
- **에러 처리** - NO-AD 상황 적절히 처리 