# AI 서비스 상태 모니터링 대시보드 - 디자인 시스템

## 프로젝트 개요

AI 서비스 상태 모니터링 대시보드는 주요 AI 서비스들과 외부 서비스들의 실시간 상태를 모니터링하는 React + TypeScript 기반의 현대적인 웹 대시보드입니다.

### 핵심 기능
- 실시간 서비스 상태 모니터링
- 컴포넌트별 세부 상태 확인
- 즐겨찾기 시스템
- 반응형 UI/UX
- 다크 테마 전용

## 기술 스택

### Frontend Framework
- **React 18.2.0** - 함수형 컴포넌트와 Hooks 사용
- **TypeScript 5.2.2** - 엄격한 타입 안전성
- **Vite 4.5.0** - 빠른 개발 서버와 HMR

### 스타일링
- **Tailwind CSS 3.4.0** - 유틸리티 퍼스트 CSS 프레임워크
- **Lucide React** - 일관된 아이콘 시스템
- **반응형 디자인** - 모바일/태블릿/데스크톱 지원

### 상태 관리 & 데이터
- **React Query 3.39.3** - 서버 상태 관리 및 캐싱
- **Axios 1.6.0** - HTTP 클라이언트
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
│   └── useStatus.ts     # 상태 관리 훅 (React Query 기반)
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

### 컬러 팔레트 (다크 테마)

#### 배경색
```css
/* 메인 배경 */
bg-gray-900 (#111827)

/* 카드 배경 */
bg-gray-800 (#1f2937)

/* 헤더 배경 */
bg-gray-700 (#374151)
```

#### 텍스트 색상
```css
/* 주요 텍스트 */
text-white (#ffffff)

/* 보조 텍스트 */
text-gray-300 (#d1d5db)

/* 설명 텍스트 */
text-gray-400 (#9ca3af)
```

#### 상태 색상
```css
/* 정상 운영 (Operational) */
text-green-400 (#10b981) / bg-green-400

/* 성능 저하 (Degraded) */
text-yellow-400 (#f59e0b) / bg-yellow-400

/* 부분 장애 (Partial Outage) */
text-orange-400 (#f97316) / bg-orange-400

/* 주요 장애 (Major Outage) */
text-red-400 (#ef4444) / bg-red-400

/* 유지보수 (Maintenance) */
text-blue-400 (#3b82f6) / bg-blue-400

/* 알 수 없음 (Unknown) */
text-gray-400 (#9ca3af) / bg-gray-400
```

#### 액센트 색상
```css
/* 즐겨찾기 */
text-yellow-400 (#f59e0b)

/* 새로고침 버튼 */
bg-blue-600 (#2563eb)

/* 호버 상태 */
hover:bg-gray-700
```

### 타이포그래피

#### 폰트 패밀리
- **시스템 폰트**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **한국어 지원**: 시스템 기본 한국어 폰트 사용

#### 크기 체계
```css
/* 페이지 제목 */
text-3xl (30px) font-bold

/* 섹션 제목 */
text-xl (20px) font-semibold

/* 서비스 이름 */
text-lg (18px) font-medium

/* 본문 텍스트 */
text-base (16px)

/* 작은 텍스트 */
text-sm (14px)

/* 매우 작은 텍스트 */
text-xs (12px)
```

### 레이아웃 시스템

#### 반응형 브레이크포인트
```css
/* 모바일 */
default (< 640px)

/* 태블릿 */
sm (640px+)

/* 데스크톱 */
md (768px+)
lg (1024px+)
xl (1280px+)

/* 커스텀 */
xs (475px+) - 추가된 소형 화면 지원
```

#### 그리드 시스템
```css
/* 서비스 그리드 */
grid-cols-1 (모바일)
md:grid-cols-2 (태블릿)
lg:grid-cols-3 (데스크톱)

/* 컴포넌트 그리드 */
grid-cols-2 (모바일)
sm:grid-cols-3 (태블릿)
md:grid-cols-4 (데스크톱)
```

#### 간격 시스템
```css
/* 컨테이너 패딩 */
px-4 (16px) sm:px-6 (24px) lg:px-8 (32px)

/* 카드 간격 */
gap-4 (16px) md:gap-6 (24px)

/* 섹션 간격 */
space-y-4 (16px) md:space-y-6 (24px)
```

### 컴포넌트 디자인

#### 카드 시스템
```css
/* 기본 카드 */
bg-gray-800 border border-gray-700 rounded-lg p-6
shadow-lg hover:shadow-xl transition-shadow

/* 서비스 카드 */
bg-gray-800 border border-gray-700 rounded-xl p-6
hover:border-gray-600 transition-colors

/* 컴포넌트 카드 */
bg-gray-750 rounded-lg p-3
hover:bg-gray-700 transition-colors
```

#### 버튼 시스템
```css
/* 주요 버튼 */
bg-blue-600 hover:bg-blue-700 text-white
px-4 py-2 rounded-lg font-medium

/* 보조 버튼 */
bg-gray-700 hover:bg-gray-600 text-gray-200
px-3 py-2 rounded-md

/* 아이콘 버튼 */
p-2 rounded-md hover:bg-gray-700
text-gray-400 hover:text-white
```

#### 상태 인디케이터
```css
/* 상태 점 */
w-3 h-3 rounded-full flex-shrink-0

/* 상태 배지 */
px-2 py-1 rounded-full text-xs font-medium
```

### 상호작용 디자인

#### 애니메이션
- **전환 효과**: `transition-all duration-300 ease-in-out`
- **호버 효과**: `hover:scale-105` (미세한 스케일 증가)
- **로딩 애니메이션**: `animate-spin` (새로고침 버튼)

#### 접근성
- **키보드 네비게이션**: `focus:outline-none focus:ring-2 focus:ring-blue-500`
- **ARIA 레이블**: 모든 인터랙티브 요소에 적용
- **스크린 리더**: 의미있는 텍스트 대안 제공

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
- **React Query** - 자동 캐싱 및 백그라운드 업데이트
- **요청 중복 제거** - 동일한 API 요청 최적화
- **에러 재시도** - 실패한 요청 자동 재시도

### 번들 최적화
- **Tree Shaking** - 불필요한 코드 제거
- **Code Splitting** - 필요시 코드 로딩
- **이미지 최적화** - 적절한 형식과 크기 사용

## 개발 가이드라인

### 코드 스타일
- **ESLint + Prettier** - 일관된 코드 포맷팅
- **TypeScript Strict Mode** - 엄격한 타입 검사
- **함수형 프로그래밍** - 순수 함수와 불변성

### 테스트 전략
- **Vitest** - 단위 테스트 프레임워크
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
- **다국어 지원** - 다양한 언어 지원
- **PWA 기능** - 오프라인 지원과 설치 가능

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