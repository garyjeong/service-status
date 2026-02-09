# 🤖 AGENTS.md - AI 에이전트 작업 가이드

> 이 문서는 Claude Code 등 AI 에이전트가 이 프로젝트를 이해하고 작업할 때 필요한 정보를 담고 있습니다.
> 마지막 업데이트: 2026-02-09

## 📋 프로젝트 개요

**프로젝트명**: service-status (AI 서비스 상태 모니터링 대시보드)
**설명**: 개발자가 자주 사용하는 AI 및 외부 서비스들의 실시간 상태를 모니터링하는 프리미엄 글래스모피즘 대시보드

**주요 특징**:
- React 19 + TypeScript 5.8 기반 모던 SPA
- Framer Motion을 활용한 3D 애니메이션과 글래스모피즘 디자인
- TanStack Query를 이용한 효율적인 데이터 관리
- Tailwind CSS 4.1 기반의 반응형 디자인
- 완전한 타입 안전성 보장

---

## 🏗️ 프로젝트 구조

```
service-status/
├── src/
│   ├── assets/                # 서비스 로고 이미지
│   │   ├── aws.png
│   │   ├── claude.png
│   │   ├── cursor.png
│   │   ├── docker.png
│   │   ├── firebase.png
│   │   ├── github.png
│   │   ├── google-ai-studio.png
│   │   ├── gpt.png
│   │   ├── netlify.png
│   │   ├── slack.png
│   │   └── supabase.jpg
│   ├── components/            # React 컴포넌트
│   │   ├── CompactDashboard.tsx      # 메인 대시보드 컴포넌트
│   │   ├── Header.tsx                # 헤더 (진행률 링 차트)
│   │   ├── ServiceCard.tsx           # 서비스 카드 (글래스모피즘)
│   │   ├── KeyboardNavigation.tsx    # 키보드 단축키
│   │   ├── SidebarFilter.tsx         # 데스크톱 필터
│   │   ├── BottomSheetFilter.tsx     # 모바일 필터
│   │   ├── AdFitBanner.tsx           # 광고 배너
│   │   ├── animations/               # Framer Motion 애니메이션
│   │   │   ├── FadeIn.tsx
│   │   │   ├── SlideUp.tsx
│   │   │   ├── ScaleIn.tsx
│   │   │   ├── Stagger.tsx
│   │   │   ├── PageTransition.tsx
│   │   │   ├── SkeletonLoader.tsx
│   │   │   └── index.ts
│   │   └── __tests__/         # 컴포넌트 테스트
│   ├── hooks/                 # Custom React Hooks
│   │   └── useStatus.ts       # 상태 관리 훅 (TanStack Query)
│   ├── services/              # API 서비스
│   │   └── api.ts            # 외부 API 통신
│   ├── types/                 # TypeScript 타입 정의
│   │   └── status.ts         # 상태 관련 타입
│   ├── utils/                 # 유틸리티 함수
│   │   └── status.ts         # 상태 변환 및 계산
│   ├── vite-env.d.ts         # Vite 환경 타입
│   ├── index.css             # 글로벌 스타일
│   └── main.tsx              # 앱 진입점
├── tests/                     # 테스트 파일
├── public/                    # 정적 리소스
├── docs/                      # 프로젝트 문서
├── scripts/                   # 배포 및 유틸 스크립트
├── Dockerfile                 # Docker 빌드 설정
├── docker-compose.yml         # Docker Compose 설정
├── nginx.conf                 # Nginx 웹 서버 설정
├── fly.toml                   # Fly.io 배포 설정
├── vite.config.ts            # Vite 빌드 도구 설정
├── tailwind.config.js        # Tailwind CSS 설정
├── tsconfig.json             # TypeScript 컴파일러 설정
├── package.json              # 프로젝트 메타데이터 및 의존성
├── .eslintrc.json            # ESLint 설정
├── .prettierrc                # Prettier 포맷팅 설정
├── env.example               # 환경 변수 예시
└── README.md                 # 프로젝트 문서

test.html                      # 정적 HTML 데모
backup/                        # 이전 Python FastAPI 버전
```

---

## 🛠️ 기술 스택

| 카테고리 | 도구/라이브러리 | 버전 |
|---------|-----------------|------|
| **런타임** | Node.js | >=18.0.0 |
| **패키지 매니저** | pnpm | >=8.0.0 (권장 8.10.0) |
| **프론트엔드** | React | 19.1.0 |
| **언어** | TypeScript | 5.8.3 |
| **빌드 도구** | Vite | 6.3.5 |
| **스타일링** | Tailwind CSS | 4.1.10 |
| **애니메이션** | Framer Motion | 12.23.12 |
| **데이터 관리** | TanStack Query | 5.80.7 |
| **HTTP 클라이언트** | Axios | 1.10.0 |
| **아이콘** | Lucide React | 0.516.0 |
| **날짜 처리** | date-fns | 4.1.0 |
| **HTML 파싱** | Cheerio | 1.1.2 |
| **테스트** | Vitest | 3.2.3 |
| **테스트 라이브러리** | @testing-library/react | 16.3.0 |
| **린터** | ESLint | 9.29.0 |
| **포매터** | Prettier | 3.5.3 |
| **CSS 후처리** | PostCSS | 8.5.6 |

---

## 📦 주요 의존성

### 프로덕션 의존성

```json
{
  "@tanstack/react-query": "^5.80.7",      // 서버 상태 관리 및 캐싱
  "@types/cheerio": "^1.0.0",              // HTML 파싱 타입
  "axios": "^1.10.0",                      // HTTP 요청
  "cheerio": "^1.1.2",                     // 웹 스크래핑
  "clsx": "^2.1.1",                        // 조건부 className 병합
  "date-fns": "^4.1.0",                    // 날짜 포맷팅
  "framer-motion": "^12.23.12",            // 3D 애니메이션
  "lucide-react": "^0.516.0",              // 아이콘 라이브러리
  "react": "^19.1.0",                      // UI 프레임워크
  "react-dom": "^19.1.0"                   // DOM 렌더링
}
```

### 개발 의존성

```json
{
  "@testing-library/jest-dom": "^6.6.3",
  "@testing-library/react": "^16.3.0",
  "@testing-library/user-event": "^14.6.1",
  "@typescript-eslint/eslint-plugin": "^8.34.1",
  "@typescript-eslint/parser": "^8.34.1",
  "@vitejs/plugin-react": "^4.5.2",
  "@vitest/coverage-v8": "^3.2.3",
  "@vitest/ui": "^3.2.3",
  "eslint": "^9.29.0",
  "eslint-plugin-react-hooks": "^5.2.0",
  "eslint-plugin-react-refresh": "^0.4.20",
  "prettier": "^3.5.3",
  "typescript": "^5.8.3",
  "vite": "^6.3.5",
  "vitest": "^3.2.3"
}
```

---

## 🚀 빌드 및 테스트 명령어

### 개발 환경

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (HMR 활성화)
pnpm dev
# 접속: http://localhost:8888/ (또는 자동 할당된 포트)

# TypeScript 타입 검사
pnpm type-check

# 개발 서버 + 타입 검사 동시 실행 (권장)
pnpm dev & pnpm type-check
```

### 빌드

```bash
# 프로덕션 최적화 빌드
pnpm build
# 출력: dist/ 디렉토리

# 빌드 결과 로컬 미리보기
pnpm preview
```

### 테스트

```bash
# 모든 테스트 실행
pnpm test

# 테스트 감시 모드 (파일 변경 시 자동 재실행)
pnpm test:watch

# 테스트 UI 대시보드
pnpm test:ui
# 접속: http://localhost:51204 (자동 표시)

# 테스트 커버리지 생성
pnpm test:coverage
# 보고서: coverage/index.html
```

### 코드 품질

```bash
# ESLint 검사
pnpm lint

# ESLint 자동 수정
pnpm lint:fix

# Prettier 포맷팅 (자동)
pnpm format

# 전체 코드 품질 체크
pnpm lint && pnpm type-check && pnpm test
```

### VS Code 디버깅

**F5 키로 실행 가능한 디버그 구성** (`.vscode/launch.json`에 정의):
- "Launch Vite Dev Server"
- "Launch Chrome Debug"
- "Debug Vite + Chrome"
- "Run Tests"
- "Run Tests (Watch)"
- "Launch Dev Server + Chrome"

---

## 🎯 코딩 컨벤션

### 네이밍 규칙

| 항목 | 규칙 | 예시 |
|------|------|------|
| **React 컴포넌트** | PascalCase | `ServiceCard.tsx`, `Header.tsx` |
| **함수/훅** | camelCase | `useStatus.ts`, `getStatusColor()` |
| **상수** | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_TIMEOUT` |
| **파일명** | PascalCase (컴포넌트) / camelCase (훅,서비스) | `ServiceCard.tsx`, `api.ts` |
| **CSS 클래스** | kebab-case (Tailwind) | `glass-panel`, `shine-effect` |
| **변수** | camelCase | `serviceStatus`, `isLoading` |

### 코드 스타일

**ESLint** + **Prettier** 자동 적용:
```bash
# 커밋 전 자동 포맷팅
pnpm format
pnpm lint:fix
```

**ESLint 규칙**:
- 권장 규칙 + TypeScript 권장 규칙 사용
- React Hooks 규칙 강제 적용
- 미사용 변수 감지 (언더스코어 `_` 제외)
- `any` 타입 사용 경고

**Prettier 설정**:
- 들여쓰기: 2 스페이스
- 세미콜론: 항상 사용
- 따옴표: 싱글 쿼트 (문자열)
- 줄 길이: 기본 (80)

### TypeScript 가이드라인

**필수 사항**:
1. 모든 함수에 타입 어노테이션 작성
2. React props 타입 정의 필수
3. 대신 명백한 타입 추론에는 타입 생략 가능
4. `any` 타입 사용 금지 (꼭 필요한 경우만 주석과 함께 사용)

**타입 정의 위치**:
- 도메인별 타입: `src/types/` 디렉토리
- 컴포넌트 props: 파일 상단 또는 별도 `types` 파일
- API 응답: `src/types/` 또는 `src/services/`

### 컴포넌트 작성 패턴

**함수형 컴포넌트**:
```typescript
interface Props {
  title: string;
  isLoading?: boolean;
}

export function MyComponent({ title, isLoading = false }: Props) {
  return <div>{title}</div>;
}
```

**훅 작성**:
```typescript
export function useStatus(serviceId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['status', serviceId],
    queryFn: () => fetchStatus(serviceId),
  });
  
  return { data, isLoading, error };
}
```

**비즈니스 로직 분리**:
- UI 로직 → 컴포넌트
- 상태 관리 → 훅
- API 통신 → `src/services/`
- 유틸리티 → `src/utils/`

### 테스트 패턴

**테스트 파일 위치**:
```
src/components/ServiceCard.tsx
src/components/__tests__/ServiceCard.test.tsx
```

또는:
```
tests/unit/utils.test.ts
tests/integration/api.test.ts
```

**테스트 작성 원칙**:
1. 구현이 아닌 동작 테스트
2. 사용자 관점의 상호작용 테스트
3. 유틸리티 함수: 100% 커버리지 목표
4. 컴포넌트: 렌더링 및 상호작용 중심

**테스트 예시**:
```typescript
describe('ServiceCard', () => {
  it('should render service name', () => {
    const { getByText } = render(
      <ServiceCard service={{ name: 'OpenAI', status: 'operational' }} />
    );
    expect(getByText('OpenAI')).toBeInTheDocument();
  });

  it('should display operational status', () => {
    const { getByText } = render(
      <ServiceCard service={{ name: 'OpenAI', status: 'operational' }} />
    );
    expect(getByText('정상 운영')).toBeInTheDocument();
  });
});
```

---

## 📋 주요 아키텍처 패턴

### 데이터 흐름

```
API / 상태 페이지
    ↓
useStatus 훅 (TanStack Query)
    ↓
컴포넌트 (렌더링)
    ↓
UI 업데이트
```

### 레이어 구조

```
📦 src/
├── components/        # UI 레이어 (렌더링만 담당)
├── hooks/            # 상태 관리 계층 (TanStack Query 활용)
├── services/         # API 통신 계층 (axios 사용)
├── utils/            # 비즈니스 로직 (순수 함수)
└── types/            # 타입 정의
```

### 상태 관리 전략

**TanStack Query** (서버 상태):
```typescript
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['services'],
  queryFn: fetchServices,
  staleTime: 1000 * 60, // 1분 캐시
  refetchInterval: 1000 * 60, // 1분마다 갱신
});
```

**React State** (로컬 상태):
```typescript
const [favorites, setFavorites] = useState<string[]>([]);
```

---

## 🔧 설정 파일 가이드

### `vite.config.ts`
- **목적**: Vite 빌드 도구 설정
- **주요 설정**:
  - React 플러그인
  - TypeScript 지원
  - 개발 서버 포트
  - 빌드 최적화 옵션

### `tsconfig.json`
- **목적**: TypeScript 컴파일러 설정
- **주요 설정**:
  - `@/*` 경로 매핑 → `src/*`
  - strict 모드 활성화
  - JSX: react-jsx

### `tailwind.config.js`
- **목적**: Tailwind CSS 커스터마이징
- **주요 설정**:
  - 커스텀 색상 팔레트
  - 글래스모피즘 효과
  - 그라디언트 정의
  - 반응형 브레이크포인트

### `.eslintrc.json`
- **목적**: 코드 품질 검사
- **주요 규칙**:
  - ESLint 권장 규칙
  - TypeScript 권장 규칙
  - React Hooks 규칙

### `.prettierrc`
- **목적**: 코드 포맷팅
- **기본 설정**:
  - 들여쓰기: 2 스페이스
  - 세미콜론: 항상
  - 싱글 쿼트: true

---

## 📡 API 및 서비스 구조

### 지원하는 서비스

**AI 서비스**:
- OpenAI (ChatGPT, API)
- Anthropic (Claude)
- Google (Gemini, AI Studio)
- Cursor (에디터)

**개발자 서비스**:
- GitHub
- Netlify
- Docker Hub
- AWS
- Slack
- Firebase
- Supabase

### API 통신 패턴

**파일**: `src/services/api.ts`

```typescript
// 단일 서비스 상태 조회
export async function fetchServiceStatus(serviceName: string) {
  // 시뮬레이션 모드 또는 실제 API 호출
  const response = await axios.get(`/api/status/${serviceName}`);
  return response.data;
}

// 모든 서비스 상태 조회
export async function fetchAllServices() {
  return Promise.all(services.map(s => fetchServiceStatus(s.name)));
}
```

---

## 🔄 PR 및 커밋 규칙

### 커밋 메시지 형식

**Conventional Commits** 사용:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**타입 (type)**:
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `refactor`: 코드 리팩토링
- `style`: 코드 스타일 변경 (포맷팅, 세미콜론 등)
- `test`: 테스트 추가/수정
- `docs`: 문서 수정
- `chore`: 의존성 업데이트, 빌드 설정 등
- `perf`: 성능 개선

**범위 (scope)** (선택):
- `ui`: UI 컴포넌트
- `api`: API 서비스
- `types`: 타입 정의
- `hooks`: 커스텀 훅
- `test`: 테스트

**예시**:
```
feat(ui): Add dark mode toggle
fix(api): Handle timeout error in service status fetch
refactor(components): Extract ServiceCard logic
test(hooks): Add useStatus hook tests
docs: Update README with new instructions
```

### 커밋 체크리스트

**커밋 전 확인사항**:
- [ ] `pnpm lint:fix` 실행 완료
- [ ] `pnpm format` 실행 완료
- [ ] `pnpm type-check` 통과
- [ ] `pnpm test` 통과 (새로운 테스트 추가)
- [ ] 커밋 메시지가 Conventional Commits 형식
- [ ] 불필요한 파일 제외 (`.env.local`, `node_modules` 등)

### Pull Request 가이드

**PR 생성 체크리스트**:
- [ ] 기본 브랜치: `main`
- [ ] 설명: PR 목적 및 변경사항 명확히 기술
- [ ] 관련 이슈 링크: `Fixes #123`
- [ ] 테스트 결과: 통과/실패 명시
- [ ] 스크린샷: UI 변경시 포함
- [ ] 라벨: 적절한 라벨 추가

**PR 제목 형식**:
```
[Type] Short description

예시:
[feat] Add service status notification
[fix] Resolve CSS layout issue on mobile
[docs] Update deployment guide
```

---

## 🐳 배포 가이드

### Fly.io 배포

```bash
# 배포 전 확인
pnpm build && pnpm test

# 배포 명령어
fly deploy --app service-status

# 배포 상태 확인
fly status --app service-status
fly logs --app service-status
```

### Docker 로컬 배포

```bash
# 이미지 빌드
docker build -t ai-dashboard .

# 컨테이너 실행
docker run -d \
  --name ai-dashboard \
  -p 8080:80 \
  ai-dashboard

# 헬스체크
curl http://localhost:8080/health
```

### Netlify 배포

```bash
# dist 폴더 배포
pnpm build
# Netlify UI에서 dist 폴더 드래그 또는 CLI 사용
```

### Vercel 배포

```bash
# Vercel CLI로 배포
npx vercel --prod
```

---

## 🐛 문제 해결 가이드

### 일반적인 문제

| 문제 | 해결책 |
|------|--------|
| **pnpm install 실패** | `rm -rf node_modules pnpm-lock.yaml && pnpm install` |
| **포트 8888 이미 사용 중** | `kill -9 $(lsof -t -i :8888)` 또는 `pnpm dev --port 8889` |
| **ESLint 오류** | `pnpm lint:fix` 실행 |
| **테스트 실패** | `pnpm test` 로그 확인, `pnpm test:ui` 시각화 확인 |
| **타입 오류** | `pnpm type-check` 실행하여 상세 오류 확인 |
| **HMR 작동 안함** | 브라우저 캐시 삭제 또는 개발 서버 재시작 |

### 개발 환경 초기화

```bash
# 완전 초기화
rm -rf node_modules pnpm-lock.yaml dist coverage
pnpm install
pnpm dev
```

---

## 📚 추가 리소스

- **README.md**: 프로젝트 상세 문서
- **docs/**: 배포 및 구성 가이드
- **script**: 배포 및 유틸 스크립트
- **Vite 공식 문서**: https://vitejs.dev
- **React 공식 문서**: https://react.dev
- **TypeScript 공식 문서**: https://www.typescriptlang.org
- **Tailwind CSS 공식 문서**: https://tailwindcss.com
- **Framer Motion 공식 문서**: https://www.framer.com/motion

---

## 🤝 작업 흐름 (AI 에이전트용)

AI 에이전트(예: Claude Code)로 이 프로젝트에서 작업할 때 권장 순서:

### 1️⃣ 프로젝트 이해 단계
```bash
# 프로젝트 구조 파악
- README.md 읽기
- package.json 확인 (의존성, 스크립트)
- src/ 디렉토리 구조 파악
```

### 2️⃣ 환경 설정 단계
```bash
# 개발 환경 준비
pnpm install
pnpm dev          # 개발 서버 시작
pnpm test:watch   # 테스트 감시 모드
```

### 3️⃣ 기능 구현 단계
```bash
# 코드 작성
- 관련 파일 읽기 및 이해
- 변경사항 작성 (TypeScript, ESLint 규칙 준수)
- 테스트 작성 또는 수정

# 코드 품질 확인
pnpm type-check
pnpm lint:fix
pnpm format
pnpm test
```

### 4️⃣ 커밋 및 배포 단계
```bash
# 커밋
git add .
git commit -m "feat(scope): description"

# PR 생성 (GitHub)
gh pr create --title "..." --body "..."

# 배포
fly deploy --app service-status
```

---

## ✅ 체크리스트

### 새로운 기능 추가 시

- [ ] 기능 분석 및 설계
- [ ] 타입 정의 (`src/types/`)
- [ ] 유틸리티 함수 작성 및 테스트
- [ ] 훅 작성 (필요시, `src/hooks/`)
- [ ] API 서비스 수정 (필요시, `src/services/`)
- [ ] 컴포넌트 구현
- [ ] 스타일링 (Tailwind CSS)
- [ ] 애니메이션 (Framer Motion)
- [ ] 컴포넌트 테스트
- [ ] 접근성 검증
- [ ] 성능 검증
- [ ] 코드 포맷팅 (`pnpm format`, `pnpm lint:fix`)
- [ ] 타입 검사 (`pnpm type-check`)
- [ ] 모든 테스트 통과 (`pnpm test`)
- [ ] PR 생성 및 코드 리뷰
- [ ] 커밋 및 병합

### 버그 수정 시

- [ ] 버그 재현
- [ ] 원인 파악
- [ ] 수정 구현
- [ ] 회귀 테스트 추가
- [ ] 코드 품질 확인
- [ ] 커밋 및 배포

---

## 📞 지원

- **문서**: README.md 참조
- **테스트**: `pnpm test:ui` 시각화 대시보드
- **코드 검사**: `pnpm lint`, `pnpm type-check`
- **디버깅**: VS Code F5 디버그 모드

---

**마지막 업데이트**: 2026-02-09
**작성자**: AI 분석 기반 자동 생성
