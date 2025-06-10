# AI 서비스 상태 모니터링 대시보드

## 프로젝트 개요

이 프로젝트는 주요 AI 서비스들의 실시간 상태를 모니터링하는 React + TypeScript 기반의 현대적인 웹 대시보드입니다.

### 모니터링 대상 서비스
- **OpenAI ChatGPT** (GPT-4, GPT-3.5)
- **Anthropic Claude** (Claude-3 Opus, Sonnet, Haiku)
- **Cursor AI** (AI 코딩 도구)
- **Google AI Studio** (Gemini Pro)

## 기술 스택

### Frontend
- **React 18** - 현대적인 UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빠른 개발 및 빌드 도구
- **pnpm** - 효율적인 패키지 관리

### 개발 도구
- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **Vitest** - 단위 테스트
- **Testing Library** - React 컴포넌트 테스트

### 상태 관리 및 데이터
- **React Query (TanStack Query)** - 서버 상태 관리
- **Axios** - HTTP 클라이언트
- **Custom Hooks** - 상태 로직 추상화

## 아키텍처

```
React SPA ↔ External APIs (via Proxy)
```

- **이전 (Python FastAPI)**: Client ↔ FastAPI Server ↔ External APIs (WebSocket)
- **현재 (React)**: Client-side rendering, 30초 폴링, 정적 호스팅 가능

## 주요 기능

### 실시간 모니터링
- 30초 간격 자동 상태 업데이트
- 수동 새로고침 지원
- 서비스별 상세 상태 정보

### 사용자 인터페이스
- **반응형 디자인** - 모바일/데스크톱 지원
- **다크/라이트 테마** - 자동 시스템 감지
- **접근성** - ARIA 레이블, 키보드 네비게이션
- **국제화** - 한국어 지원

### 상태 표시
- **정상 운영** (Operational) - 녹색
- **성능 저하** (Degraded) - 노란색  
- **부분 장애** (Partial Outage) - 주황색
- **주요 장애** (Major Outage) - 빨간색
- **유지보수** (Maintenance) - 파란색
- **알 수 없음** (Unknown) - 회색

## 프로젝트 구조

```
ai-status-check/
├── src/                          # 소스 코드
│   ├── components/               # React 컴포넌트
│   │   └── Dashboard.tsx        # 메인 대시보드
│   ├── hooks/                   # 커스텀 React Hooks
│   │   └── useStatus.ts         # 상태 관리 훅
│   ├── services/                # API 서비스
│   │   └── api.ts              # 외부 API 통신
│   ├── types/                   # TypeScript 타입 정의
│   │   └── status.ts           # 상태 관련 타입
│   ├── utils/                   # 유틸리티 함수
│   │   └── status.ts           # 상태 처리 유틸
│   ├── test/                   # 테스트 설정
│   │   └── setup.ts            # 테스트 환경 설정
│   └── main.tsx                # 앱 진입점
├── tests/                       # 테스트 파일
│   └── utils/                  # 유틸리티 테스트
│       └── status.test.ts      # 상태 유틸 테스트
├── public/                      # 정적 파일
│   └── favicon.svg             # 파비콘
├── backup/                      # 이전 Python 코드 백업
│   ├── app/                    # FastAPI 앱
│   ├── requirements.txt        # Python 의존성
│   └── docker-compose.yml      # Docker 설정
├── package.json                # Node.js 의존성
├── vite.config.ts             # Vite 설정
├── tsconfig.json              # TypeScript 설정
├── .eslintrc.json             # ESLint 설정
├── .prettierrc                # Prettier 설정
├── index.html                 # HTML 템플릿
└── README.md                  # 프로젝트 문서
```

## 개발 워크플로우

### 1. 의존성 설치
```bash
pnpm install
```

### 2. 개발 서버 실행
```bash
pnpm dev
```

### 3. 테스트 실행
```bash
pnpm test        # 단위 테스트
pnpm test:watch  # 감시 모드
pnpm test:ui     # UI 모드
```

### 4. 빌드 및 배포
```bash
pnpm build       # 프로덕션 빌드
pnpm preview     # 빌드 미리보기
```

### 5. 코드 품질
```bash
pnpm lint        # ESLint 검사
pnpm lint:fix    # ESLint 자동 수정
pnpm format      # Prettier 포맷팅
```

## 테스트 전략

### TDD (Test-Driven Development)
- 유틸리티 함수 100% 커버리지
- 컴포넌트 단위 테스트
- 통합 테스트 시나리오

### 테스트 도구
- **Vitest** - 빠른 단위 테스트
- **Testing Library** - React 컴포넌트 테스트
- **MSW** - API 모킹

## 배포 옵션

### 정적 호스팅
- **Netlify** - 자동 배포, CORS 프록시
- **Vercel** - Next.js 스타일 배포
- **GitHub Pages** - 무료 호스팅

### Docker 지원
```bash
# 이전 Python 버전 (backup/)
docker-compose up -d

# React 버전 (새로운 Dockerfile 필요)
docker build -t ai-dashboard .
docker run -p 3000:3000 ai-dashboard
```

## 마이그레이션 히스토리

### 이전: Python FastAPI 백엔드
- Jinja2 템플릿 렌더링
- WebSocket 실시간 연결
- 포트 8888에서 실행
- Python 의존성 관리

### 현재: React Frontend
- 클라이언트 사이드 렌더링
- 30초 폴링 업데이트
- 포트 5173에서 개발 (Vite)
- npm/pnpm 의존성 관리

### 개선 사항
- **성능**: 정적 호스팅, CDN 활용 가능
- **개발 경험**: HMR, TypeScript, 현대적 도구
- **유지보수**: 단일 언어 생태계, 컴포넌트 기반
- **배포**: Netlify/Vercel 원클릭 배포

## 환경 변수

### 개발 환경 (.env.local)
```env
VITE_API_PROXY_URL=http://localhost:5173
VITE_POLLING_INTERVAL=30000
```

### Vite 프록시 설정
- OpenAI API: `/api/openai/*`
- Anthropic API: `/api/anthropic/*`
- Cursor API: `/api/cursor/*`
- Google AI: `/api/google/*`

## 성능 최적화

### 번들 최적화
- Tree shaking으로 불필요한 코드 제거
- Code splitting으로 초기 로딩 최적화
- Lazy loading으로 필요시 컴포넌트 로드

### 네트워크 최적화
- API 응답 캐싱 (React Query)
- 실패한 요청 자동 재시도
- 백그라운드 업데이트

### 사용자 경험
- 로딩 상태 표시
- 오프라인 지원 (미래 계획)
- 푸시 알림 (미래 계획)

## 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능 