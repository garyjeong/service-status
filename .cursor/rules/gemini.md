# GEMINI.md — AI 협업 가이드

이 문서는 **Gemini CLI** 에이전트가 모든 프로젝트(프론트엔드, 백엔드, 인프라)에서 일관되게 작업하도록 지침을 제공합니다. “계획 → 검토 → 구현” 3단계 흐름을 필수 게이트로 사용하여 **Minimal Change Principle (MCP)** 을 준수하며, 한국어 전문 업무 어조를 유지합니다.

---

## 1. 핵심 원칙

1. **MCP 준수** – 기존 코드/설계를 최대한 유지하며 필요한 최소 변경만 수행합니다.
2. **3‑Gate 워크플로**

   * `<PROTOCOL:EXPLAIN>` : 문제·현황 분석, 개선 가능 여부 설명만 수행.
   * `<PROTOCOL:PLAN>`   : 변경 상세 계획 수립·제안. *반드시* 인간 승인 필요.
   * `<PROTOCOL:IMPLEMENT>` : 승인된 PLAN 그대로 실행(코드 작성·파일 수정·커밋 등).
3. **한국어, 공적·전문 어조** – 모든 출력은 존중하는 한국어 비즈니스 문체를 사용합니다.
4. **결과 정리** – 각 단계 종료 시 TL;DR 요약 5줄 이하 + 세부 항목을 표·리스트로 반환합니다.
5. **보안 & 안전** – 민감 키·비밀정보를 Git 기록에 남기지 말고 `.env`, Secret Manager 등을 사용합니다.

---

## 2. 코드 스타일 & 포맷팅

| 스택                              | 기본 규칙                                                         | 주요 툴                          |
| ------------------------------- | ------------------------------------------------------------- | ----------------------------- |
| **Python / FastAPI**            | PEP 8, Black, Ruff, 타입힌트 100%, 로깅은 `structlog`                | `pytest`, `uvicorn[standard]` |
| **Node / TypeScript / Next.js** | ESLint Airbnb‑base + Prettier, React 18, Server Components 우선 | `jest`, `playwright`          |
| **Go**                          | `go fmt`, `golangci‑lint`, 의존성 최소화                            | `go test`, `benchstat`        |
| **Rust / Axum**                 | `rustfmt`, `clippy`, `tokio` async                            | `cargo test`, `criterion`     |
| **Infra (Docker/K8s)**          | 멀티‑스테이지 이미지, 최소 Base, 모듈화된 Helm Chart                         | `Docker Buildx`, `skaffold`   |

> 새로운 언어·프레임워크 발견 시 **EXPLAIN** 단계에서 현재 코딩 규칙 조사 후 테이블에 추가 제안하십시오.

---

## 3. 프론트엔드 지침

* **디자인 시스템**: Tailwind CSS + shadcn/ui, 12‑column Grid, dark mode 지원.
* **접근성**: WCAG AA 이상, 키보드 네비게이션 필수.
* **국제화**: i18n(한국어 기본, 영어 보조) 함수 placeholder 적용.
* **빌드/배포**: Turborepo & PNPM Workspace 권장.

---

## 4. 백엔드 지침

* **API**: REST + OpenAPI 3 또는 GraphQL. Swagger UI (/docs) 자동 노출.
* **데이터층**: PostgreSQL 우선, MySQL 대체 가능. 마이그레이션은 Flyway/Prisma Migrate.
* **CQRS/도메인**: 필요한 경우만, 과도한 복잡도 지양.
* **테스트 커버리지**: 80% 이상 유지. 신규 코드 100% 목표.

---

## 5. 인프라 & DevOps

1. **CI/CD**: GitHub Actions → Docker Build → GHCR push → ArgoCD Sync (Kubernetes).
2. **Helm Values** – 환경별(prod, staging, dev) values 파일 유지.
3. **Observability**: OpenTelemetry Trace + Prometheus Metric + Loki Log.
4. **IaC**: Terraform Cloud 또는 Pulumi(TypeScript) 선호.

---

## 6. 툴 사용 규칙

* **허용**: `run_shell_command`, `read_file`, `write_file`, `search_code`, `apply_patch`.
* **금지**: 시스템 파괴적 명령(예 `rm ‑rf /`), 미승인 `glob` 사용.
* **대규모 변경**: 10개 파일 이상 수정 시 PLAN 모드에서 변경 범위·롤백 전략 필수 기술.

---

## 7. 대용량 컨텍스트 전략

* 20 K 토큰 이상 코드 분석 시 파일 목록·구조만 우선 요약 후, 세부 파일별  @ 인클루드 방식 사용.
* 필요하면 chunking(200 줄 단위) & iterative prompt 사용.

---

## 8. 예시 Prompt

> **/EXPLAIN** `프로젝트 전반적인 아키텍처를 요약하고, 병목 구간을 찾아줘`
>
> **/PLAN** `FastAPI 엔드포인트 인증 로직 개선안을 제시해. 변경 파일, 인터페이스 영향을 표로 보여줘`
>
> **/IMPLEMENT** `PLAN #2 승인. 실제 코드 적용 및 테스트 코드 생성을 진행해 줘`

---

## 9. 확인 체크리스트 (자동 출력)

1. [ ] MCP 준수 여부
2. [ ] 테스트 통과 (CI 녹색)
3. [ ] 보안 키 유출 없음
4. [ ] README & CHANGELOG 갱신
5. [ ] PR 템플릿 사용

---

### ⬛ 버전: 2025‑07‑26 작성

이 가이드는 향후 프로젝트 요구사항에 따라 업데이트될 수 있습니다. 수정 요청 시 **EXPLAIN** → **PLAN** → **IMPLEMENT** 순으로 반영하십시오.
