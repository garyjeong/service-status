# 🌐 외부 서비스 상태 모니터링 대시보드

실시간으로 개발자가 자주 사용하는 외부 서비스들의 상태를 모니터링하는 다크 테마 전용 React 대시보드입니다.

## ⚡ 기술 스택 (2024년 최신)

- **Frontend**: React 19 + TypeScript 5.8
- **Build Tool**: Vite 6.3
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS 4.1 + CSS Variables
- **Testing**: Vitest 3.2 + Testing Library 16.3
- **HTTP Client**: Axios 1.10
- **Icons**: 실제 AI 서비스 로고 이미지 + Lucide React 0.516
- **State Management**: React Hooks + TanStack Query 5.8
- **Development**: VS Code F5 디버그 모드 지원

## 🚀 지원되는 서비스

### AI 서비스
- **OpenAI ChatGPT** - ChatGPT 웹 인터페이스 및 OpenAI API
  - 하위 컴포넌트: ChatGPT Web, OpenAI API, DALL-E, Whisper API, GPT-4 API, GPT-3.5 API
- **Anthropic Claude** - Claude 채팅 인터페이스 및 Anthropic API
  - 하위 컴포넌트: Claude Chat, Anthropic API, Claude Pro, API Console, Claude-3 모델들
- **Cursor Editor** - AI 기반 코드 에디터 및 개발 도구
  - 하위 컴포넌트: Desktop App, AI Copilot, Sync Service, Extensions, Editor Core, AI Assistant
- **Google AI Studio** - Google Gemini API 및 AI Studio 플랫폼
  - 하위 컴포넌트: Gemini API, AI Studio, Model Garden, Vertex AI, Gemini Vision

### 외부 서비스
- **GitHub** - 코드 저장소 및 협업 플랫폼
  - 하위 컴포넌트: Git Operations, API Requests, Issues & PRs, Actions, Pages, Packages, Codespaces, Copilot
- **Netlify** - 정적 사이트 호스팅 및 배포
  - 하위 컴포넌트: CDN, Builds, Edge Functions, Forms, DNS, Identity, Analytics
- **Docker Hub** - 컨테이너 이미지 레지스트리
  - 하위 컴포넌트: Registry, Build Service, Webhooks, Organizations, Authentication, Container Registry
- **AWS** - 클라우드 컴퓨팅 플랫폼
  - 하위 컴포넌트: EC2, S3, RDS, Lambda, CloudFront, Route 53, CloudWatch, IAM, ECS, EKS
- **Slack** - 팀 커뮤니케이션 플랫폼
  - 하위 컴포넌트: Messaging, Calls, File Sharing, Apps & Integrations, Notifications, Search, Workspace Admin, Enterprise Grid
- **Firebase** - 백엔드 서비스 플랫폼
  - 하위 컴포넌트: Realtime Database, Firestore, Authentication, Hosting, Functions, Storage, Cloud Messaging, Remote Config, Crashlytics, Performance

## 📦 설치 및 실행

### 요구사항

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 설치

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
# React 앱: http://localhost:8888/ (또는 자동 할당된 포트: 8889, 8890 등)

# 프로덕션 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview
```

### HTML 데모 실행

정적 HTML 데모도 제공됩니다:

```bash
# 간단한 HTTP 서버로 HTML 데모 실행
python3 -m http.server 8001
# HTML 데모: http://localhost:8001/test.html
```

### 테스트 실행

```bash
# 테스트 실행
pnpm test

# 테스트 UI 모드
pnpm test:ui

# 테스트 커버리지
pnpm test:coverage
```

### 코드 품질

```bash
# ESLint 검사
pnpm lint

# ESLint 자동 수정
pnpm lint:fix

# Prettier 포맷팅
pnpm format

# TypeScript 타입 검사
pnpm type-check
```

### VS Code 디버깅

```bash
# F5 키로 디버그 모드 실행
# .vscode/launch.json 설정 완료

# 사용 가능한 디버그 구성:
# - "Launch Vite Dev Server" - 개발 서버 시작
# - "Launch Chrome Debug" - Chrome 브라우저 디버그
# - "Debug Vite + Chrome" - 서버 + 브라우저 통합 디버그
# - "Run Tests" - 테스트 실행
# - "Run Tests (Watch)" - 테스트 감시 모드
# - "Launch Dev Server + Chrome" - 복합 설정
```

## 🏗️ 프로젝트 구조

```
src/
├── assets/             # 정적 리소스 (서비스 로고)
│   ├── aws.png         # AWS 로고
│   ├── claude.png      # Anthropic 로고
│   ├── cursor.png      # Cursor 로고
│   ├── docker.png      # Docker Hub 로고
│   ├── firebase.png    # Firebase 로고
│   ├── github.png      # GitHub 로고
│   ├── google-ai-studio.png # Google AI 로고
│   ├── gpt.png         # OpenAI 로고
│   ├── netlify.png     # Netlify 로고
│   └── slack.png       # Slack 로고
├── components/         # React 컴포넌트
│   └── Dashboard.tsx   # 메인 대시보드 (올인원 컴포넌트)
├── hooks/             # Custom React Hooks
│   └── useStatus.ts   # 상태 관리 훅
├── services/          # API 서비스
│   └── api.ts        # 외부 API 통신
├── types/            # TypeScript 타입 정의
│   └── status.ts     # 상태 관련 타입
├── utils/            # 유틸리티 함수
│   └── status.ts     # 상태 변환 및 계산
├── vite-env.d.ts     # Vite 환경 타입 (이미지 import 포함)
└── main.tsx          # 앱 진입점

test.html             # 정적 HTML 데모
backup/               # 이전 Python FastAPI 버전
tests/                # 테스트 파일
public/               # 정적 파일
```

## 🎨 주요 기능

### 실시간 상태 모니터링
- **15초마다 자동 상태 업데이트** (이전 30초에서 개선)
- **수동 새로고침 기능** - 전체 및 개별 서비스 새로고침
- **실시간 상태 변경 알림** - 상태 변화 시 즉시 반영
- **즐겨찾기 보존** - 새로고침 후에도 즐겨찾기 설정 유지

### 개선된 사용자 인터페이스 (2024년 12월 업데이트)
- **서비스 아이콘 상단 정렬** - 모든 서비스 아이콘이 카드 상단에 위치
- **상태 표시 최적화** - 아이콘 바로 아래에 상태 점과 아이콘 배치
- **상태페이지 링크 하단 배치** - 각 서비스 카드 하단에 상태페이지 링크 위치
- **중복 이모지 제거** - 하위 서비스에서 불필요한 이모지 표시 제거
- **개별 서비스 새로고침** - 각 서비스 카드에서 독립적인 새로고침 버튼

### 아이콘 시스템
- **실제 서비스 로고**: 각 서비스에 최적화된 PNG 이미지 내장
- **일관된 크기**: 32px 크기로 최적화 (카드 내), 24px (즐겨찾기)
- **TypeScript 지원**: 완전한 타입 안전성 보장
- **호버 효과**: 부드러운 애니메이션과 그라데이션 효과

### 사용자 인터페이스
- **반응형 디자인** (모바일/데스크톱 지원)
- **다크 테마 전용** (개발자 친화적 인터페이스)
- **전체 시스템 상태 요약** - 헤더에 통합 상태 표시
- **부드러운 애니메이션 및 트랜지션**
- **다국어 지원** - 한국어/영어 전환 가능
- **즐겨찾기 시스템** - 중요한 서비스 컴포넌트 즐겨찾기

### 상태 시각화
- 색상으로 구분된 상태 표시
  - 🟢 정상 운영 (operational)
  - 🟡 성능 저하 (degraded)  
  - 🔴 서비스 장애 (outage)
- **서비스별 하위 컴포넌트 상태** 세부 정보
- **전체 시스템 상태 요약** - 로딩/정상/저하/장애 서비스 수 표시
- **실시간 업데이트 시간 표시**
- **스켈레톤 로딩 UI** - 개별 서비스 로딩 중 표시

### 다중 버전 지원
- **React SPA**: 모던 웹앱 버전
- **정적 HTML**: 의존성 없는 단순 버전

## 🧪 테스트

이 프로젝트는 TDD(Test-Driven Development) 방식으로 개발되었습니다.

### 테스트 커버리지

- **유틸리티 함수**: 100% 커버리지
- **React 훅**: 핵심 로직 테스트
- **컴포넌트**: 렌더링 및 상호작용 테스트
- **API 서비스**: 모킹을 통한 API 테스트

### 테스트 종류

- **단위 테스트**: 개별 함수 및 훅
- **통합 테스트**: 컴포넌트 상호작용
- **E2E 테스트**: 전체 사용자 플로우

## 🔧 설정

### 이미지 리소스

프로젝트는 각 AI 서비스의 공식 로고를 `src/assets/` 폴더에 저장합니다:

```typescript
// 이미지 import 예시
import gptIcon from '@/assets/gpt.png';
import claudeIcon from '@/assets/claude.png';
import cursorIcon from '@/assets/cursor.png';
import googleAiIcon from '@/assets/google-ai-studio.png';

// ServiceIcon 컴포넌트에서 사용
<img src={gptIcon} alt="GPT" style={{ width: 32, height: 32 }} />
```

### TypeScript 설정

이미지 파일 import를 위한 타입 선언:

```typescript
// src/vite-env.d.ts
declare module '*.svg' {
  const content: string;
  export default content;
}
declare module '*.png' {
  const content: string;
  export default content;
}
declare module '*.webp' {
  const content: string;
  export default content;
}
```

### 환경 변수

현재 버전은 시뮬레이션 모드로 작동하며, 실제 API 키가 필요하지 않습니다.
실제 API 연동 시에는 CORS 이슈 해결을 위해 Vite 개발 서버의 프록시를 사용할 수 있습니다.

```typescript
// vite.config.ts에서 프록시 설정 (필요시)
proxy: {
  '/api/openai': {
    target: 'https://status.openai.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/openai/, ''),
  },
  // ... 기타 서비스
}
```

### 빌드 최적화

- **코드 분할**: 자동 청크 분리
- **트리 쉐이킹**: 사용하지 않는 코드 제거
- **번들 압축**: esbuild를 통한 최적화
- **이미지 최적화**: Vite의 asset 처리

## 🚀 배포

### Netlify 배포

```bash
# 빌드
pnpm build

# dist 폴더를 Netlify에 배포
# _redirects 파일 설정 필요 (SPA routing용)
```

### Vercel 배포

```bash
# vercel CLI 사용
npx vercel --prod
```

### Docker 배포

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🎯 개발 가이드

### 새로운 AI 서비스 추가

1. **로고 이미지 추가**: `src/assets/` 폴더에 서비스 로고 추가
2. **ServiceIcon 컴포넌트 업데이트**: 새 서비스 케이스 추가
3. **API 서비스 업데이트**: `src/services/api.ts`에 새 서비스 fetcher 추가
4. **타입 정의 업데이트**: 필요시 타입 정의 추가

### 아이콘 크기 조정

```typescript
// Dashboard.tsx에서 아이콘 크기 변경
<ServiceIcon iconName={service.icon} size={32} /> // 메인 서비스 카드
<ServiceIcon iconName={service.icon} size={24} /> // 즐겨찾기 카드
```

## 🤝 기여 가이드

1. 프로젝트 포크
2. 기능 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치 푸시 (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

### 코딩 컨벤션

- TypeScript 사용 필수
- ESLint + Prettier 규칙 준수
- 컴포넌트는 함수형 컴포넌트 사용
- 테스트 코드 작성 필수
- 이미지 리소스는 최적화된 포맷 사용

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🛠️ 이전 버전 (Python FastAPI)

이전 Python FastAPI 버전의 코드는 `backup/` 폴더에서 확인할 수 있습니다.

### 마이그레이션 사유

1. **성능 향상**: 클라이언트 사이드 렌더링으로 더 빠른 응답
2. **확장성**: 정적 호스팅으로 비용 절약 및 확장성 개선
3. **개발 경험**: 현대적인 React + TypeScript 스택
4. **유지보수**: 단일 언어 생태계로 일관성 향상
5. **비주얼 개선**: 실제 AI 서비스 로고와 현대적 UI/UX

## 📞 지원

문제가 발생하거나 제안사항이 있으시면 [Issues](https://github.com/your-repo/issues)에 등록해 주세요.

## 📈 최근 업데이트

### v2.1.0 (2024년 12월 - 최신)
- ✨ **UI/UX 대폭 개선**: 서비스 아이콘 상단 정렬, 상태 표시 최적화
- 🔄 **개별 서비스 새로고침**: 각 서비스별 독립적인 새로고침 버튼 추가
- 💾 **즐겨찾기 보존**: 새로고침 후에도 즐겨찾기 설정 유지
- 🎨 **레이아웃 개선**: 상태페이지 링크를 카드 하단으로 이동
- 🧹 **UI 정리**: 하위 서비스에서 중복 이모지 제거
- ⚡ **성능 개선**: 15초 자동 업데이트 (이전 30초에서 개선)
- 🌍 **다국어 지원**: 한국어/영어 전환 기능
- 📱 **반응형 개선**: 모바일/데스크톱 최적화

### v2.0.0 (이전)
- ✨ **실제 AI 서비스 로고 이미지 적용**: 이모지 대신 공식 로고 사용
- 🎨 **아이콘 크기 증대**: 24px → 48px로 가독성 향상
- 📱 **하위 컴포넌트 상태 모니터링**: 각 서비스의 세부 컴포넌트별 상태 표시
- 🌓 **다크/라이트 모드**: 테마 전환 기능
- 📄 **HTML 데모 버전**: 의존성 없는 정적 HTML 버전 제공
- 🔧 **TypeScript 완전 지원**: 이미지 import 타입 안전성
- ⚡ **성능 최적화**: 인라인 스타일 및 최적화된 컴포넌트 구조
