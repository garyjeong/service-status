# 📋 모니터링 서비스 정의서

> **마지막 업데이트**: 2025-01-30  
> **심층 조사 완료**: 2025-01-30 (실제 API 호출을 통한 정확한 컴포넌트 수 확인)  
> **총 서비스 수**: 35개

이 문서는 Service Status Dashboard에서 모니터링하는 모든 서비스의 정의와 설정을 포함합니다.

---

## 📊 서비스 카테고리

### 🤖 AI/ML (13개)
AI 및 머신러닝 서비스 플랫폼

### ☁️ Cloud (8개)
클라우드 인프라 및 호스팅 서비스

### 🛠️ DevTools (7개)
개발 도구 및 협업 플랫폼

### 💼 Business (7개)
비즈니스 및 운영 도구

---

## 🤖 AI/ML 서비스

### 1. OpenAI ChatGPT
- **서비스 ID**: `openai`
- **표시명**: OpenAI ChatGPT
- **설명**: ChatGPT 웹 인터페이스 및 OpenAI API
- **상태 페이지**: https://status.openai.com
- **API Endpoint**: `https://status.openai.com/api/v2/status.json`
- **Components API**: `https://status.openai.com/api/v2/components.json`
- **모니터링 방식**: StatusPage API v2 (자동 Components API 호출)
- **하위 컴포넌트**: **총 30개** (실제 API에서 동적 조회, 실패 시 Fallback 사용)
  - Video viewing, Embeddings, Login, Connectors, GPTs, Video generation, Image Generation, Sora, Voice mode, Realtime, Audio, Images, Deep Research, Feed, Chat Completions, Agent, Responses, Files, Batch, Fine-tuning, Search, Moderations, Codex, Compliance API, File uploads, ChatGPT Atlas, Conversations 등
- **참고**: `ServiceStatusFetcher`를 통해 자동으로 components.json을 호출하여 실제 30개 컴포넌트 상태를 조회합니다. API 실패 시 Fallback으로 6개 컴포넌트만 표시됩니다.

### 2. Anthropic Claude
- **서비스 ID**: `anthropic`
- **표시명**: Anthropic Claude
- **설명**: Claude 채팅 인터페이스 및 Anthropic API
- **상태 페이지**: https://status.anthropic.com
- **API Endpoint**: `https://status.anthropic.com/api/v2/status.json`
- **Components API**: `https://status.anthropic.com/api/v2/components.json`
- **모니터링 방식**: StatusPage API v2 (자동 Components API 호출)
- **하위 컴포넌트**: **총 4개** (실제 API에서 동적 조회, 실패 시 Fallback 사용)
  - claude.ai
  - platform.claude.com (formerly console.anthropic.com)
  - Claude API (api.anthropic.com)
  - Claude Code
- **참고**: `ServiceStatusFetcher`를 통해 자동으로 components.json을 호출하여 실제 4개 컴포넌트 상태를 조회합니다. API 실패 시 Fallback으로 7개 컴포넌트가 표시됩니다.

### 3. Cursor Editor
- **서비스 ID**: `cursor`
- **표시명**: Cursor Editor
- **설명**: AI 기반 코드 에디터 및 개발 도구
- **상태 페이지**: https://status.cursor.com
- **API Endpoint**: `https://status.cursor.com/api/v2/status.json`
- **Components API**: `https://status.cursor.com/api/v2/components.json`
- **모니터링 방식**: StatusPage API v2 (수동 Components API 호출)
- **하위 컴포넌트**: **총 10개** (실제 API에서 동적 조회, 실패 시 Fallback 사용)
  - Chat - Agent & Custom Modes
  - User Dashboard (cursor.com)
  - Infrastructure
  - PR Indexing
  - Tab
  - Cursor Forum (forum.cursor.com)
  - Slack Integration
  - BugBot
  - Codebase Indexing
  - Extension Marketplace
- **참고**: `fetchCursorStatus` 함수에서 components.json을 직접 호출하여 그룹이 아닌 실제 10개 컴포넌트만 필터링합니다.

### 4. Google AI Studio
- **서비스 ID**: `googleai`
- **표시명**: Google AI Studio
- **설명**: Google Gemini API 및 AI Studio 플랫폼
- **상태 페이지**: https://aistudio.google.com/status
- **API Endpoint**: 없음 (공개 API 없음)
- **모니터링 방식**: 기본 상태 (정상으로 가정)
- **하위 컴포넌트**:
  - Gemini API
  - AI Studio
  - Model Garden
  - Vertex AI
  - Gemini Vision

### 5. Perplexity AI
- **서비스 ID**: `perplexity`
- **표시명**: Perplexity AI
- **설명**: AI 검색 엔진 및 대화형 AI 플랫폼
- **상태 페이지**: https://status.perplexity.ai
- **API Endpoint**: `https://status.perplexity.ai/api/v2/status.json`
- **모니터링 방식**: StatusPage API v2 (하드코딩된 컴포넌트)
- **하위 컴포넌트**: (하드코딩, status.json의 전체 상태를 각 컴포넌트에 적용)
  - Website
  - API
- **참고**: `fetchPerplexityStatus` 함수에서 하드코딩된 컴포넌트 목록을 사용합니다.

### 6. xAI (Grok)
- **서비스 ID**: `xai`
- **표시명**: xAI
- **설명**: Grok AI 모델 및 플랫폼 서비스
- **상태 페이지**: https://status.x.ai
- **API Endpoint**: `https://status.x.ai/feed.xml` (RSS 피드)
- **모니터링 방식**: RSS 피드 파싱
- **하위 컴포넌트**:
  - Grok (iOS)
  - Grok (Android)
  - Grok (Web)
  - Single Sign-On
  - API (US East)
  - API (US West)
  - API Console
  - Docs
  - xAI Website
  - Grok in X

### 7. Groq / GroqCloud
- **서비스 ID**: `groq`
- **표시명**: Groq / GroqCloud
- **설명**: Groq AI 모델 플랫폼 및 추론 서비스
- **상태 페이지**: https://groqstatus.com
- **API Endpoint**: `https://groqstatus.com/api/v2/status.json`
- **Components API**: `https://groqstatus.com/api/v2/components.json`
- **모니터링 방식**: StatusPage API v2 (자동 Components API 호출)
- **하위 컴포넌트**: **총 20개** (실제 API에서 동적 조회, 실패 시 Fallback 사용)
  - API, Website
  - AI 모델: meta-llama/llama-prompt-guard-2-22m, meta-llama/llama-prompt-guard-2-86m, meta-llama/llama-4-maverick-17b-128e-instruct, meta-llama/llama-guard-4-12b, llama-3.1-8b-instant, llama-3.3-70b-versatile, meta-llama/llama-4-scout-17b-16e-instruct
  - OpenAI 모델: openai/gpt-oss-20b, openai/gpt-oss-120b, openai/gpt-oss-safeguard-20b
  - 기타: playai-tts, playai-tts-arabic, qwen/qwen3-32b, groq/compound, groq/compound-mini, whisper-large-v3, whisper-large-v3-turbo, moonshotai/kimi-k2-instruct-0905
- **참고**: `ServiceStatusFetcher`를 통해 자동으로 components.json을 호출하여 실제 20개 컴포넌트 상태를 조회합니다.

### 8. DeepSeek
- **서비스 ID**: `deepseek`
- **표시명**: DeepSeek
- **설명**: DeepSeek AI 모델 및 플랫폼 서비스
- **상태 페이지**: https://status.deepseek.com
- **API Endpoint**: `https://status.deepseek.com/api/v2/status.json`
- **Components API**: `https://status.deepseek.com/api/v2/components.json`
- **모니터링 방식**: StatusPage API v2 (자동 Components API 호출)
- **하위 컴포넌트**: **총 2개** (실제 API에서 동적 조회, 실패 시 Fallback 사용)
  - API 服务 (API Service)
  - 网页对话服务 (Web Chat Service)
- **참고**: `ServiceStatusFetcher`를 통해 자동으로 components.json을 호출하여 실제 2개 컴포넌트 상태를 조회합니다. API 실패 시 Fallback으로 4개 컴포넌트가 표시됩니다.

### 9. Leonardo AI
- **서비스 ID**: `leonardo`
- **표시명**: Leonardo AI
- **설명**: AI 이미지 생성 플랫폼
- **상태 페이지**: (미구현)
- **모니터링 방식**: 미구현

### 10. Hailuo AI
- **서비스 ID**: `hailuo`
- **표시명**: Hailuo AI
- **설명**: AI 비디오 생성 플랫폼
- **상태 페이지**: (미구현)
- **모니터링 방식**: 미구현

### 11. Consensus
- **서비스 ID**: `consensus`
- **표시명**: Consensus
- **설명**: AI 기반 연구 검색 엔진
- **상태 페이지**: (미구현)
- **모니터링 방식**: 미구현

### 12. Mage
- **서비스 ID**: `mage`
- **표시명**: Mage
- **설명**: AI 이미지 생성 도구
- **상태 페이지**: (미구현)
- **모니터링 방식**: 미구현

### 13. Vooster
- **서비스 ID**: `vooster`
- **표시명**: Vooster
- **설명**: AI 기반 생산성 도구
- **상태 페이지**: (미구현)
- **모니터링 방식**: 미구현

---

## ☁️ Cloud 서비스

### 1. AWS (Amazon Web Services)
- **서비스 ID**: `aws`
- **표시명**: AWS
- **설명**: 아마존 웹 서비스 클라우드 플랫폼
- **상태 페이지**: https://status.aws.amazon.com
- **API Endpoint**: `https://status.aws.amazon.com/api/v2/status.json`
- **Components API**: `https://status.aws.amazon.com/api/v2/components.json`
- **모니터링 방식**: StatusPage API v2 (수동 Components API 호출, 실패 시 웹 스크래핑)
- **하위 컴포넌트**: (실제 API에서 동적 조회, 실패 시 Fallback 또는 웹 스크래핑)
  - Amazon EC2
  - Amazon S3
  - Amazon RDS
  - AWS Lambda
  - Amazon CloudFront
  - Amazon Route 53
  - Amazon CloudWatch
  - AWS Identity and Access Management
  - Amazon ECS
  - Amazon EKS
  - Amazon VPC
  - Amazon API Gateway
  - Amazon DynamoDB
  - Amazon ElastiCache
  - Amazon Elasticsearch Service
- **참고**: `fetchAWSStatus` 함수에서 components.json을 직접 호출하여 그룹이 아닌 실제 컴포넌트만 필터링합니다. API 실패 시 웹 스크래핑으로 전환됩니다.

### 2. Firebase
- **서비스 ID**: `firebase`
- **표시명**: Firebase
- **설명**: Google 백엔드 서비스 플랫폼
- **상태 페이지**: https://status.firebase.google.com
- **API Endpoint**: 없음
- **모니터링 방식**: 웹 스크래핑
- **하위 컴포넌트**: (웹 스크래핑으로 조회, 실패 시 Fallback 사용)
  - AB Testing (BETA) (Fallback)
  - App Check (Fallback)
  - App Distribution (Fallback)
  - App Hosting (Fallback)
  - App Indexing (Fallback)
  - Authentication (Fallback)
  - Cloud Messaging (Fallback)
  - Console (Fallback)
  - Crashlytics (Fallback)
  - Data Connect (Fallback)
  - Dynamic Links (Fallback)
  - Extensions (Fallback)
  - Firebase AI Logic (Fallback)
  - Firebase Studio (Fallback)
  - Gemini in Firebase (Fallback)
  - Genkit (Fallback)
  - Hosting (Fallback)
  - Machine Learning (BETA) (Fallback)
  - Performance Monitoring (Fallback)
  - Realtime Database (Fallback)
  - Remote Config (Fallback)
  - Test Lab (Fallback)
- **참고**: `FirebaseStatusParser`를 통해 HTML을 파싱하여 컴포넌트 상태를 추출합니다. 실패 시 하드코딩된 23개 컴포넌트 목록을 사용합니다.

### 3. Supabase
- **서비스 ID**: `supabase`
- **표시명**: Supabase
- **설명**: 오픈소스 Firebase 대안 백엔드 플랫폼
- **상태 페이지**: https://status.supabase.com
- **API Endpoint**: `https://status.supabase.com/api/v2/status.json`
- **Components API**: `https://status.supabase.com/api/v2/components.json`
- **모니터링 방식**: StatusPage API v2 (수동 Components API 호출)
- **하위 컴포넌트**: **총 26개** (실제 API에서 동적 조회, 실패 시 Fallback 사용)
  - Analytics, API Gateway, Auth, Connection Pooler, Dashboard, Database, Edge Functions, Management API, Realtime, Storage
  - 지역별 컴포넌트: ap-northeast-1, ap-northeast-2, ap-south-1, ap-southeast-1, ap-southeast-2, ca-central-1, eu-central-1, eu-central-2, eu-north-1, eu-west-1, eu-west-2, eu-west-3, sa-east-1, us-east-1, us-east-2, us-west-1 등
- **참고**: `fetchSupabaseStatus` 함수에서 components.json을 직접 호출하여 실제 26개 컴포넌트(서비스 + 지역별) 상태를 조회합니다. API 실패 시 Fallback으로 10개 컴포넌트만 표시됩니다.

### 4. Netlify
- **서비스 ID**: `netlify`
- **표시명**: Netlify
- **설명**: 정적 사이트 호스팅 및 배포 플랫폼
- **상태 페이지**: https://www.netlifystatus.com
- **API Endpoint**: `https://www.netlifystatus.com/api/v2/status.json`
- **Components API**: `https://www.netlifystatus.com/api/v2/components.json`
- **모니터링 방식**: StatusPage API v2 (자동 Components API 호출)
- **하위 컴포넌트**: **총 36개** (실제 API에서 동적 조회, 실패 시 Fallback 사용)
  - High-Performance Edge Network, Standard Edge Network, Origin Servers, Build Pipeline, Netlify Application UI, API, Hosted DNS, Prerendering, Identity, Netlify Functions, Analytics, Log Drains, Collaborative Deploy Previews, Git Gateway, Edge Functions, Netlify Image CDN, Netlify Blobs, Netlify Connect, Netlify Create API, Visual Editor, Netlify Forms, Domain Purchasing, Billing, Agent Runners
  - Git 통합: Atlassian Bitbucket API/Webhooks/SSH, GitHub API Requests/Webhooks/Git Operations
  - 기타: npm Registry, NS1 API/Management Portal, Name.com, Netlify Support Forums, Netlify Helpdesk
- **참고**: `ServiceStatusFetcher`를 통해 자동으로 components.json을 호출하여 실제 36개 컴포넌트 상태를 조회합니다. API 실패 시 Fallback으로 7개 컴포넌트만 표시됩니다.

### 5. Vercel
- **서비스 ID**: `vercel`
- **표시명**: Vercel
- **설명**: 프론트엔드 클라우드 플랫폼 및 서버리스 배포 서비스
- **상태 페이지**: https://www.vercel-status.com
- **API Endpoint**: `https://www.vercel-status.com/api/v2/status.json`
- **Components API**: `https://www.vercel-status.com/api/v2/components.json` (실제 51개 컴포넌트 존재)
- **모니터링 방식**: StatusPage API v2 (하드코딩된 컴포넌트)
- **하위 컴포넌트**: **하드코딩 10개** (실제 API에는 51개 컴포넌트 존재, status.json의 전체 상태를 각 컴포넌트에 적용)
  - Edge Network
  - Serverless Functions
  - Edge Functions
  - Build System
  - Dashboard
  - CLI
  - Domains
  - Analytics
  - Postgres
  - Blob Storage
- **참고**: `fetchVercelStatus` 함수에서 하드코딩된 10개 컴포넌트 목록을 사용합니다. 실제 API에는 51개 컴포넌트(지역별 엣지 네트워크 포함)가 있지만, 현재는 하드코딩된 목록만 사용합니다.

### 6. Heroku
- **서비스 ID**: `heroku`
- **표시명**: Heroku
- **설명**: 클라우드 애플리케이션 플랫폼 (PaaS)
- **상태 페이지**: https://status.heroku.com
- **API Endpoint**: `https://status.heroku.com/api/v4/current-status`
- **모니터링 방식**: Heroku Status API v4 (비표준 API)
- **하위 컴포넌트**: (API에서 동적 조회, `data.status` 배열에서 `system` 필드 추출)
  - Apps
  - Data
  - Tools
- **참고**: `fetchHerokuStatus` 함수에서 Heroku 전용 API v4를 사용하며, `status` 배열의 각 `system` 필드를 컴포넌트로 매핑합니다.

### 7. Cloudflare
- **서비스 ID**: `cloudflare`
- **표시명**: Cloudflare
- **설명**: CDN, DNS, 보안 및 성능 최적화 서비스
- **상태 페이지**: https://www.cloudflarestatus.com
- **API Endpoint**: `https://www.cloudflarestatus.com/api/v2/components.json`
- **모니터링 방식**: StatusPage API v2 (수동 Components API 호출)
- **하위 컴포넌트**: (실제 API에서 동적 조회, 실패 시 Fallback 사용)
  - CDN (Fallback)
  - DNS (Fallback)
  - SSL/TLS (Fallback)
  - Workers (Fallback)
- **참고**: `fetchCloudflareStatus` 함수에서 components.json을 직접 호출하고, `group_id`가 없고 이름이 'Operational'이 아닌 컴포넌트만 필터링합니다.

### 8. Docker Hub
- **서비스 ID**: `dockerhub`
- **표시명**: Docker Hub
- **설명**: 컨테이너 이미지 레지스트리 및 저장소
- **상태 페이지**: https://www.dockerstatus.com
- **API Endpoint**: 없음
- **모니터링 방식**: 웹 스크래핑
- **하위 컴포넌트**: (웹 스크래핑으로 조회, 실패 시 Fallback 사용)
  - Docker Hub Registry (Fallback)
  - Docker Authentication (Fallback)
  - Docker Hub Web Services (Fallback)
  - Docker Desktop (Fallback)
  - Docker Billing (Fallback)
  - Docker Package Repositories (Fallback)
  - Docker Hub Automated Builds (Fallback)
  - Docker Hub Security Scanning (Fallback)
  - Docker Docs (Fallback)
  - Docker Community Forums (Fallback)
  - Docker Support (Fallback)
  - Docker.com Website (Fallback)
  - Docker Scout (Fallback)
  - Docker Build Cloud (Fallback)
  - Testcontainers Cloud (Fallback)
  - Docker Cloud (Fallback)
  - Docker Hardened Images (Fallback)
- **참고**: `DockerStatusParser`를 통해 HTML을 파싱하여 컴포넌트 상태를 추출합니다. 실패 시 하드코딩된 17개 컴포넌트 목록을 사용합니다.

---

## 🛠️ DevTools 서비스

### 1. GitHub
- **서비스 ID**: `github`
- **표시명**: GitHub
- **설명**: 코드 저장소 및 협업 플랫폼
- **상태 페이지**: https://www.githubstatus.com
- **API Endpoint**: `https://www.githubstatus.com/api/v2/status.json`
- **Components API**: `https://www.githubstatus.com/api/v2/components.json`
- **모니터링 방식**: StatusPage API v2 (자동 Components API 호출)
- **하위 컴포넌트**: **총 11개** (실제 API에서 동적 조회, 실패 시 Fallback 사용)
  - Git Operations
  - Webhooks
  - API Requests
  - Issues
  - Pull Requests
  - Actions
  - Packages
  - Pages
  - Codespaces
  - Copilot
  - Visit www.githubstatus.com for more information
- **참고**: `ServiceStatusFetcher`를 통해 자동으로 components.json을 호출하여 실제 11개 컴포넌트 상태를 조회합니다. API 실패 시 Fallback으로 8개 컴포넌트만 표시됩니다.

### 2. GitLab
- **서비스 ID**: `gitlab`
- **표시명**: GitLab
- **설명**: DevOps 플랫폼 및 Git 저장소 호스팅 서비스
- **상태 페이지**: https://status.gitlab.com
- **API Endpoint**: `https://status.gitlab.com/api/v2/status.json`
- **모니터링 방식**: StatusPage API v2 (하드코딩된 컴포넌트)
- **하위 컴포넌트**: (하드코딩, status.json의 전체 상태를 각 컴포넌트에 적용)
  - GitLab.com
  - Git Operations
  - CI/CD
  - Container Registry
  - Package Registry
  - Pages
  - API
  - Webhooks
  - Merge Requests
  - Issues
- **참고**: `fetchGitLabStatus` 함수에서 하드코딩된 컴포넌트 목록을 사용합니다.

### 3. CircleCI
- **서비스 ID**: `circleci`
- **표시명**: CircleCI
- **설명**: 지속적 통합 및 배포 (CI/CD) 플랫폼
- **상태 페이지**: https://status.circleci.com
- **API Endpoint**: `https://status.circleci.com/api/v2/components.json`
- **모니터링 방식**: StatusPage API v2 (수동 Components API 호출)
- **하위 컴포넌트**: **총 14개** (실제 API에서 동적 조회, 실패 시 Fallback 사용)
  - Docker Jobs
  - Machine Jobs
  - macOS Jobs
  - Windows Jobs
  - Pipelines & Workflows
  - CircleCI API
  - CircleCI UI
  - Artifacts
  - Runner
  - CircleCI Webhooks
  - CircleCI Insights
  - CircleCI Releases
  - Notifications & Status Updates
  - Billing & Account
- **참고**: `fetchCircleCIStatus` 함수에서 components.json을 직접 호출하여 실제 14개 컴포넌트 상태를 조회합니다. API 실패 시 Fallback으로 4개 컴포넌트만 표시됩니다.

### 4. Atlassian
- **서비스 ID**: `atlassian`
- **표시명**: Atlassian
- **설명**: Jira, Confluence, Bitbucket 등 개발 협업 도구
- **상태 페이지**: https://developer.status.atlassian.com
- **API Endpoint**: `https://developer.status.atlassian.com/api/v2/components.json`
- **모니터링 방식**: StatusPage API v2 (수동 Components API 호출)
- **하위 컴포넌트**: **총 1개** (실제 API에서 동적 조회, 실패 시 Fallback 사용)
  - Authentication and user management
- **참고**: `fetchAtlassianStatus` 함수에서 components.json을 직접 호출하여 실제 1개 컴포넌트 상태를 조회합니다. API 실패 시 Fallback으로 3개 컴포넌트가 표시됩니다.

### 5. Replit
- **서비스 ID**: `replit`
- **표시명**: Replit
- **설명**: 온라인 코딩 환경 및 협업 개발 플랫폼
- **상태 페이지**: https://status.replit.com
- **API Endpoint**: `https://status.replit.com/api/v2/status.json`
- **모니터링 방식**: StatusPage API v2 (하드코딩된 컴포넌트)
- **하위 컴포넌트**: (하드코딩, status.json의 전체 상태를 각 컴포넌트에 적용)
  - Website
  - Repls
  - AI
  - Hosting
  - Auth
  - Deployments
  - Database
  - Package Manager
- **참고**: `fetchReplitStatus` 함수에서 하드코딩된 8개 컴포넌트 목록을 사용합니다.

### 6. v0 by Vercel
- **서비스 ID**: `v0`
- **표시명**: v0 by Vercel
- **설명**: AI 기반 UI 생성 및 프로토타이핑 플랫폼
- **상태 페이지**: https://www.vercel-status.com
- **API Endpoint**: `https://www.vercel-status.com/api/v2/status.json`
- **모니터링 방식**: StatusPage API v2 (하드코딩된 컴포넌트, Vercel 상태 페이지 통합)
- **하위 컴포넌트**: (하드코딩, status.json의 전체 상태를 각 컴포넌트에 적용)
  - v0 Platform
  - AI Generation
  - Code Export
- **참고**: `fetchV0Status` 함수에서 하드코딩된 컴포넌트 목록을 사용하며, Vercel 상태 페이지의 전체 상태를 참조합니다.

### 7. Hugging Face
- **서비스 ID**: `huggingface`
- **표시명**: Hugging Face
- **설명**: AI 모델 허브 및 머신러닝 플랫폼
- **상태 페이지**: https://status.huggingface.co
- **API Endpoint**: `https://status.huggingface.co/api/v2/status.json`
- **모니터링 방식**: StatusPage API v2 (하드코딩된 컴포넌트)
- **하위 컴포넌트**: (하드코딩, status.json의 전체 상태를 각 컴포넌트에 적용)
  - Hub
  - Inference API
  - Inference Endpoints
  - Spaces
  - Datasets
  - AutoTrain
  - Model Cards
  - Transformers Library
- **참고**: `fetchHuggingFaceStatus` 함수에서 하드코딩된 8개 컴포넌트 목록을 사용합니다.

---

## 💼 Business 서비스

### 1. Stripe
- **서비스 ID**: `stripe`
- **표시명**: Stripe
- **설명**: 온라인 결제 처리 및 금융 인프라 플랫폼
- **상태 페이지**: https://status.stripe.com
- **API Endpoint**: `https://status.stripe.com/api/v2/status.json`
- **모니터링 방식**: StatusPage API v2 (하드코딩된 컴포넌트)
- **하위 컴포넌트**: (하드코딩, status.json의 전체 상태를 각 컴포넌트에 적용)
  - API
  - Dashboard
  - Webhooks
  - Connect
  - Checkout
  - Billing
  - Issuing
  - Terminal
  - Sigma
  - Atlas
- **참고**: `fetchStripeStatus` 함수에서 하드코딩된 10개 컴포넌트 목록을 사용합니다.

### 2. Auth0
- **서비스 ID**: `auth0`
- **표시명**: Auth0
- **설명**: 인증 및 권한 관리 플랫폼
- **상태 페이지**: https://auth0.statuspage.io
- **API Endpoint**: `https://auth0.statuspage.io/api/v2/components.json`
- **모니터링 방식**: StatusPage API v2 (수동 Components API 호출)
- **하위 컴포넌트**: (실제 API에서 동적 조회, 실패 시 Fallback 사용)
  - User Authentication (Fallback)
  - Management API (Fallback)
  - Dashboard (Fallback)
  - Tenant Logs (Fallback)
- **참고**: `fetchAuth0Status` 함수에서 components.json을 직접 호출하고, `group_id`가 없고 이름이 'Operational'이 아닌 컴포넌트만 필터링합니다.

### 3. Slack
- **서비스 ID**: `slack`
- **표시명**: Slack
- **설명**: 팀 커뮤니케이션 및 협업 플랫폼
- **상태 페이지**: https://slack-status.com
- **API Endpoint**: 없음
- **모니터링 방식**: 웹 스크래핑
- **하위 컴포넌트**: (웹 스크래핑으로 조회, 실패 시 Fallback 사용)
  - Login/SSO (Fallback)
  - Connectivity (Fallback)
  - Messaging (Fallback)
  - Files (Fallback)
  - Notifications (Fallback)
  - Huddles (Fallback)
  - Search (Fallback)
  - Apps/Integrations/APIs (Fallback)
  - Workspace/Org Administration (Fallback)
  - Workflows (Fallback)
  - Canvases (Fallback)
- **참고**: `SlackStatusParser`를 통해 HTML을 파싱하여 컴포넌트 상태를 추출합니다. 실패 시 하드코딩된 11개 컴포넌트 목록을 사용합니다.

### 4. SendGrid
- **서비스 ID**: `sendgrid`
- **표시명**: SendGrid
- **설명**: 이메일 전송 및 마케팅 플랫폼
- **상태 페이지**: https://status.sendgrid.com
- **API Endpoint**: `https://status.sendgrid.com/api/v2/components.json`
- **모니터링 방식**: StatusPage API v2 (수동 Components API 호출)
- **하위 컴포넌트**: (실제 API에서 동적 조회, 실패 시 Fallback 사용)
  - Web API (Fallback)
  - SMTP (Fallback)
  - Marketing Campaigns (Fallback)
  - Event Webhook (Fallback)
- **참고**: `fetchSendGridStatus` 함수에서 components.json을 직접 호출하고, `group_id`가 없고 이름이 'Operational'이 아닌 컴포넌트만 필터링합니다.

### 5. Datadog
- **서비스 ID**: `datadog`
- **표시명**: Datadog
- **설명**: 모니터링, 로깅, APM 및 보안 플랫폼
- **상태 페이지**: https://status.datadoghq.com
- **API Endpoint**: `https://status.datadoghq.com/api/v2/components.json`
- **모니터링 방식**: StatusPage API v2 (수동 Components API 호출)
- **하위 컴포넌트**: (실제 API에서 동적 조회, 실패 시 Fallback 사용)
  - Infrastructure Monitoring (Fallback)
  - APM (Fallback)
  - Logs (Fallback)
  - Synthetics (Fallback)
- **참고**: `fetchDatadogStatus` 함수에서 components.json을 직접 호출하고, `group_id`가 없고 이름이 'Operational'이 아닌 컴포넌트만 필터링합니다.

### 6. MongoDB Atlas
- **서비스 ID**: `mongodb`
- **표시명**: MongoDB Atlas
- **설명**: 클라우드 NoSQL 데이터베이스 서비스
- **상태 페이지**: https://status.mongodb.com
- **API Endpoint**: `https://status.mongodb.com/api/v2/status.json`
- **모니터링 방식**: StatusPage API v2 (하드코딩된 컴포넌트)
- **하위 컴포넌트**: (하드코딩, status.json의 전체 상태를 각 컴포넌트에 적용)
  - Clusters
  - Atlas Data API
  - Atlas Search
  - Atlas Device Sync
  - Charts
  - Atlas Functions
  - Atlas Triggers
  - Atlas GraphQL
  - Data Lake
  - Online Archive
- **참고**: `fetchMongoDBStatus` 함수에서 하드코딩된 10개 컴포넌트 목록을 사용합니다.

### 7. Zeta Global
- **서비스 ID**: `zetaglobal`
- **표시명**: Zeta Global
- **설명**: 마케팅 플랫폼 및 데이터 분석 서비스
- **상태 페이지**: https://status.zetaglobal.net
- **API Endpoint**: `https://status.zetaglobal.net/api/v2/status.json`
- **모니터링 방식**: StatusPage API v2 (하드코딩된 컴포넌트)
- **하위 컴포넌트**: (하드코딩, status.json의 전체 상태를 각 컴포넌트에 적용)
  - Web Application
  - Platform
  - Platform Access
  - Data Import
  - Audience Segmentation
  - Campaigns
  - Reports
  - End-to-End Sending Infrastructure
  - API
  - Auth API
  - People API
  - Events API
  - Customers API
  - Recommendations
  - Resources API
- **참고**: `fetchZetaGlobalStatus` 함수에서 하드코딩된 15개 컴포넌트 목록을 사용합니다.

---

## 📊 모니터링 방식 요약

### StatusPage API v2

대부분의 서비스가 StatusPage.io를 사용하는 StatusPage API v2를 제공합니다.

**특징**:
- `status.json`: 전체 서비스 상태
- `components.json`: 개별 컴포넌트 상태
- 표준화된 API 형식
- 실시간 상태 업데이트

**구현 방식별 분류**:

1. **자동 Components API 호출** (`ServiceStatusFetcher` 사용):
   - OpenAI (30개), Anthropic (4개), GitHub (11개), Netlify (36개), Groq (20개), DeepSeek (2개)
   - 자동으로 `components.json`을 호출하여 실제 컴포넌트 상태를 조회
   - 실패 시 Fallback 컴포넌트 목록 사용 (일반적으로 더 적은 수의 컴포넌트)

2. **수동 Components API 호출** (개별 함수에서 직접 호출):
   - Cursor (10개), AWS (그룹만 존재, 웹 스크래핑 사용), Supabase (26개), CircleCI (14개), Atlassian (1개), Auth0, SendGrid, Cloudflare, Datadog
   - 각 함수에서 `components.json`을 직접 호출
   - 그룹이 아닌 실제 컴포넌트만 필터링 (`!component.group` 또는 `!component.group_id`)
   - 실패 시 Fallback 컴포넌트 목록 사용 (일반적으로 더 적은 수의 컴포넌트)

3. **하드코딩된 컴포넌트** (status.json만 사용):
   - Perplexity (2개), Vercel (10개, 실제 API에는 51개 존재), Replit (8개), Stripe, MongoDB (10개), Hugging Face (8개), GitLab (10개), Zeta Global (15개), v0 (3개)
   - `status.json`의 전체 상태를 각 하드코딩된 컴포넌트에 적용
   - Components API를 호출하지 않음 (Vercel의 경우 실제로는 51개 컴포넌트가 있지만 하드코딩된 10개만 사용)

**사용 서비스**: OpenAI, Anthropic, GitHub, Netlify, Supabase, Groq, DeepSeek, Cursor, Perplexity, Vercel, Replit, Stripe, MongoDB, Hugging Face, GitLab, CircleCI, Atlassian, Auth0, SendGrid, Cloudflare, Datadog, Zeta Global

### 웹 스크래핑
StatusPage API가 없는 서비스는 웹 스크래핑을 통해 상태를 조회합니다.

**특징**:
- HTML 파싱을 통한 상태 추출
- 커스텀 파서 필요
- API 변경 시 파서 업데이트 필요

**사용 서비스**: Docker Hub, Slack, Firebase, AWS (fallback)

### RSS 피드
일부 서비스는 RSS 피드를 통해 상태 정보를 제공합니다.

**특징**:
- XML 형식의 피드 파싱
- 최신 상태 정보 추출

**사용 서비스**: xAI (Grok)

### 기본 상태
공개 API가 없는 서비스는 기본적으로 정상 상태로 가정합니다.

**사용 서비스**: Google AI Studio

---

## 🔧 API 호출 설정

### CORS 프록시
모든 API 호출은 CORS 프록시를 통해 이루어집니다.

**지원 프록시**:
1. `https://api.allorigins.win/raw?url=`
2. `https://corsproxy.io/?`
3. `https://api.codetabs.com/v1/proxy?quest=`

**재시도 로직**:
- 최대 3회 재시도
- 프록시 자동 전환
- 지수 백오프 (1초, 2초, 4초)

### 타임아웃
- 기본 타임아웃: 10초
- 웹사이트 체크: 8초

---

## 📝 서비스 추가 가이드

새로운 서비스를 추가하려면:

1. **서비스 정보 확인**
   - 상태 페이지 URL 확인
   - API 엔드포인트 확인 (StatusPage API v2 지원 여부)
   - 하위 컴포넌트 목록 확인

2. **코드 추가**
   - `src/services/api.ts`에 fetcher 함수 추가
   - `src/types/categories.ts`에 카테고리 추가
   - `src/components/ServiceCard.tsx`에 아이콘 추가 (필요시)

3. **테스트**
   - API 호출 테스트
   - 상태 표시 확인
   - 에러 처리 확인

자세한 내용은 [개발 가이드](../README.md#-개발-가이드) 또는 [프로젝트 분석 보고서](./PROJECT_ANALYSIS.md)를 참조하세요.

---

---

## 📝 컴포넌트 조회 방식 상세

### 1. 자동 Components API 호출 (`ServiceStatusFetcher`)

다음 서비스들은 `ServiceStatusFetcher` 클래스를 통해 자동으로 `components.json`을 호출합니다:

- **OpenAI**: `fetchOpenAIStatus()` → `ServiceStatusFetcher.fetchServiceStatus('openai')` (실제 30개 컴포넌트)
- **Anthropic**: `fetchAnthropicStatus()` → `ServiceStatusFetcher.fetchServiceStatus('anthropic')` (실제 4개 컴포넌트)
- **GitHub**: `fetchGitHubStatus()` → `ServiceStatusFetcher.fetchServiceStatus('github')` (실제 11개 컴포넌트)
- **Netlify**: `fetchNetlifyStatus()` → `ServiceStatusFetcher.fetchServiceStatus('netlify')` (실제 36개 컴포넌트)
- **Groq**: `fetchGroqStatus()` → `ServiceStatusFetcher.fetchServiceStatus('groq')` (실제 20개 컴포넌트)
- **DeepSeek**: `fetchDeepSeekStatus()` → `ServiceStatusFetcher.fetchServiceStatus('deepseek')` (실제 2개 컴포넌트)

**처리 로직**:
1. `status.json` 호출하여 전체 상태 확인
2. 자동으로 `components.json` 호출 시도
3. 그룹이 아닌 실제 컴포넌트만 필터링 (`!component.group`)
4. 실패 시 `SERVICES_CONFIG`의 Fallback 컴포넌트 목록 사용

### 2. 수동 Components API 호출

다음 서비스들은 각각의 함수에서 `components.json`을 직접 호출합니다:

- **Cursor**: `fetchCursorStatus()` - 그룹 필터링 (`!component.group`) (실제 10개 컴포넌트)
- **AWS**: `fetchAWSStatus()` - 그룹 필터링 (`!component.group`) (그룹만 존재, 웹 스크래핑 사용)
- **Supabase**: `fetchSupabaseStatus()` - 컴포넌트 이름 매칭 방식 (실제 26개 컴포넌트)
- **CircleCI**: `fetchCircleCIStatus()` - 그룹 필터링 (`!component.group_id`) (실제 14개 컴포넌트)
- **Atlassian**: `fetchAtlassianStatus()` - 그룹 필터링 (`!component.group_id`) (실제 1개 컴포넌트)
- **Auth0**: `fetchAuth0Status()` - 그룹 필터링 (`!component.group_id`)
- **SendGrid**: `fetchSendGridStatus()` - 그룹 필터링 (`!component.group_id`)
- **Cloudflare**: `fetchCloudflareStatus()` - 그룹 필터링 (`!component.group_id`)
- **Datadog**: `fetchDatadogStatus()` - 그룹 필터링 (`!component.group_id`)

**처리 로직**:
1. `status.json` 또는 `components.json` 직접 호출
2. 그룹이 아닌 실제 컴포넌트만 필터링
3. 실패 시 하드코딩된 Fallback 컴포넌트 목록 사용

### 3. 하드코딩된 컴포넌트

다음 서비스들은 `status.json`의 전체 상태를 하드코딩된 컴포넌트 목록에 적용합니다:

- **Perplexity**: 2개 컴포넌트
- **v0**: 3개 컴포넌트
- **Replit**: 8개 컴포넌트
- **Vercel**: 10개 컴포넌트
- **Stripe**: 10개 컴포넌트
- **MongoDB**: 10개 컴포넌트
- **Hugging Face**: 8개 컴포넌트
- **GitLab**: 10개 컴포넌트
- **Zeta Global**: 15개 컴포넌트

**처리 로직**:
1. `status.json`만 호출
2. 하드코딩된 컴포넌트 목록에 전체 상태 적용
3. Components API를 호출하지 않음

### 4. 웹 스크래핑

다음 서비스들은 HTML 파싱을 통해 컴포넌트 상태를 추출합니다:

- **Docker Hub**: `DockerStatusParser` 사용
- **Slack**: `SlackStatusParser` 사용
- **Firebase**: `FirebaseStatusParser` 사용
- **AWS**: Fallback으로 웹 스크래핑 사용

**처리 로직**:
1. 상태 페이지 HTML 다운로드
2. 커스텀 파서로 컴포넌트 상태 추출
3. 실패 시 하드코딩된 Fallback 컴포넌트 목록 사용

### 5. 특수 API

- **Heroku**: Heroku Status API v4 사용 (`/api/v4/current-status`)
- **xAI**: RSS 피드 파싱 (`/feed.xml`)
- **Google AI Studio**: 공개 API 없음, 기본 상태로 가정

---

**작성자**: AI Assistant  
**최종 업데이트**: 2025-01-30  
**심층 조사 완료**: 2025-01-30 (실제 API 호출을 통한 정확한 컴포넌트 수 확인 및 문서 업데이트)

