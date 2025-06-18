# 외부 서비스 상태 모니터링 대시보드

## 프로젝트 개요

이 프로젝트는 주요 외부 서비스들의 실시간 상태를 모니터링하는 React + TypeScript 기반의 현대적인 웹 대시보드입니다.

### 모니터링 대상 서비스

#### AI 서비스
- **OpenAI ChatGPT** (ChatGPT 웹 인터페이스 및 OpenAI API)
- **Anthropic Claude** (Claude 채팅 인터페이스 및 Anthropic API)
- **Cursor Editor** (AI 기반 코드 에디터 및 개발 도구)
- **Google AI Studio** (Google Gemini API 및 AI Studio 플랫폼)

#### 외부 서비스
- **GitHub** (코드 저장소 및 협업 플랫폼)
- **Netlify** (정적 사이트 호스팅 및 배포)
- **Docker Hub** (컨테이너 이미지 레지스트리)
- **AWS** (클라우드 컴퓨팅 플랫폼)
- **Slack** (팀 커뮤니케이션 플랫폼)
- **Firebase** (백엔드 서비스 플랫폼)
- **Supabase** (오픈소스 Firebase 대안 백엔드 플랫폼)

## 기술 스택

### Frontend
- **React 19** - 최신 UI 라이브러리 (19.1.0)
- **TypeScript 5.8** - 최신 타입 안전성
- **Vite 6.3** - 최신 개발 및 빌드 도구
- **pnpm** - 효율적인 패키지 관리
- **Tailwind CSS 4.1** - 최신 유틸리티 우선 CSS 프레임워크

### 개발 도구
- **ESLint 9** - 최신 코드 품질 관리
- **Prettier 3.5** - 최신 코드 포맷팅
- **Vitest 3.2** - 최신 단위 테스트 프레임워크
- **Testing Library** - React 16.3 컴포넌트 테스트

### 상태 관리 및 데이터
- **TanStack Query 5.8** - 최신 서버 상태 관리
- **Axios 1.10** - 최신 HTTP 클라이언트
- **Custom Hooks** - 상태 로직 추상화

## 아키텍처

```
React SPA ↔ External APIs (via Proxy)
```

- **이전 (Python FastAPI)**: Client ↔ FastAPI Server ↔ External APIs (WebSocket)
- **현재 (React)**: Client-side rendering, 15초 폴링, 정적 호스팅 가능

## 주요 기능

### 실시간 모니터링
- **15초 간격 자동 상태 업데이트** - 이전 30초에서 개선
- **수동 새로고침 지원** - 전체 및 개별 서비스 새로고침
- **서비스별 상세 상태 정보** - 하위 컴포넌트 상태 표시
- **즐겨찾기 보존** - 새로고침 후에도 즐겨찾기 설정 유지

### 사용자 인터페이스
- **반응형 디자인** - 모바일/데스크톱 지원
- **다크 테마 전용** - 개발자 친화적 어두운 인터페이스
- **접근성** - ARIA 레이블, 키보드 네비게이션
- **국제화** - 한국어/영어 지원
- **즐겨찾기 시스템** - 중요한 서비스 컴포넌트 즐겨찾기
- **개별 서비스 새로고침** - 각 서비스 카드에서 개별 새로고침 가능
- **개선된 레이아웃** - 아이콘 상단 배치, 상태 표시 최적화

### 상태 표시
- **정상 운영** (Operational) - 녹색
- **성능 저하** (Degraded) - 노란색  
- **부분 장애** (Partial Outage) - 주황색
- **주요 장애** (Major Outage) - 빨간색
- **유지보수** (Maintenance) - 파란색
- **알 수 없음** (Unknown) - 회색

### UI/UX 개선사항 (2024년 12월 업데이트)
- **서비스 아이콘 상단 정렬** - 모든 서비스 아이콘이 카드 상단에 위치
- **상태 표시 최적화** - 아이콘 바로 아래에 상태 점과 아이콘 배치
- **상태페이지 링크 하단 배치** - 각 서비스 카드 하단에 상태페이지 링크 위치
- **중복 이모지 제거** - 하위 서비스에서 불필요한 이모지 표시 제거
- **즐겨찾기 보존 기능** - 새로고침 시에도 즐겨찾기 설정 유지
- **개별 서비스 새로고침** - 각 서비스별 독립적인 새로고침 버튼

## 프로젝트 구조

```
ai-status-check/
├── src/                          # 소스 코드
│   ├── components/               # React 컴포넌트
│   │   └── Dashboard.tsx        # 메인 대시보드 (단일 컴포넌트)
│   ├── hooks/                   # 커스텀 React Hooks
│   │   └── useStatus.ts         # 상태 관리 훅
│   ├── services/                # API 서비스
│   │   └── api.ts              # 외부 API 통신
│   ├── types/                   # TypeScript 타입 정의
│   │   └── status.ts           # 상태 관련 타입
│   ├── utils/                   # 유틸리티 함수
│   │   └── status.ts           # 상태 처리 유틸
│   ├── assets/                  # 정적 자산
│   │   ├── aws.png             # AWS 로고
│   │   ├── claude.png          # Anthropic 로고
│   │   ├── cursor.png          # Cursor 로고
│   │   ├── docker.png          # Docker 로고
│   │   ├── firebase.png        # Firebase 로고
│   │   ├── github.png          # GitHub 로고
│   │   ├── google-ai-studio.png # Google AI 로고
│   │   ├── gpt.png             # OpenAI 로고
│   │   ├── netlify.png         # Netlify 로고
│   │   ├── slack.png           # Slack 로고
│   │   └── supabase.jpg        # Supabase 로고
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
├── CONTEXT.md                 # 프로젝트 컨텍스트 (현재 파일)
├── README.md                  # 프로젝트 문서
└── DESIGN.md                  # 디자인 시스템 문서
```

## 개발 워크플로우

### 1. 의존성 설치
```bash
pnpm install
```

### 2. 개발 서버 실행
```bash
pnpm dev
# 자동으로 사용 가능한 포트 할당 (8888, 8889, 8890 등)
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

### 6. VS Code 디버깅
```bash
# F5 키로 디버그 모드 실행 가능
# .vscode/launch.json 설정 완료
# 다음 디버그 옵션 사용 가능:
# - Launch Vite Dev Server
# - Launch Chrome Debug
# - Debug Vite + Chrome
# - Run Tests
# - Run Tests (Watch)
# - Launch Dev Server + Chrome (복합 설정)
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
- 15초 폴링 업데이트 (이전 30초에서 개선)
- 포트 자동 할당 (8888, 8889, 8890 등)
- npm/pnpm 의존성 관리

### 개선 사항 (2024년 12월 업데이트)
- **성능**: 정적 호스팅, CDN 활용 가능
- **개발 경험**: HMR, TypeScript 5.8, React 19, 최신 도구
- **유지보수**: 단일 언어 생태계, 컴포넌트 기반
- **배포**: Netlify/Vercel 원클릭 배포
- **디버깅**: VS Code F5 디버그 모드 지원
- **최신 기술**: Tailwind CSS 4.1, Vite 6.3, TanStack Query 5.8
- **UI/UX**: 개선된 레이아웃, 즐겨찾기 보존, 개별 새로고침
- **접근성**: 향상된 키보드 네비게이션, ARIA 지원

## 환경 변수

### 개발 환경 (.env.local)
```env
VITE_API_PROXY_URL=http://localhost:5173
VITE_POLLING_INTERVAL=15000
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
- 개별 서비스 로딩으로 부분 업데이트

### 사용자 경험
- 로딩 상태 표시 (스켈레톤 UI)
- 즐겨찾기 설정 보존
- 부드러운 애니메이션
- 반응형 디자인

## 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능 