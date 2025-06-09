# AI Service Status Dashboard

실시간 AI 서비스 상태 모니터링 대시보드 - ChatGPT, Claude, Cursor의 서비스 상태를 한눈에 확인하세요.

## ✨ 주요 기능

- 🔄 **실시간 상태 모니터링**: ChatGPT (OpenAI), Claude (Anthropic), Cursor 서비스 상태 실시간 확인
- 📊 **시각적 대시보드**: 직관적인 UI로 서비스 상태를 색상과 아이콘으로 표시
- ⚡ **WebSocket 기반**: 새로고침 없이 실시간으로 상태 업데이트
- 🎛️ **설정 가능한 갱신 간격**: 5초부터 5분까지 사용자 설정 가능
- 📱 **반응형 디자인**: 데스크톱, 태블릿, 모바일 모든 환경 지원
- 🧩 **컴포넌트별 상태**: 각 서비스의 세부 구성요소별 상태 정보

## 🛠️ 기술 스택

- **Backend**: FastAPI, Python 3.12
- **Frontend**: Jinja2, HTML5, CSS3, JavaScript (ES6+)
- **Real-time**: WebSocket
- **HTTP Client**: aiohttp, httpx
- **Web Scraping**: BeautifulSoup4
- **Testing**: pytest, pytest-asyncio

## 🚀 실행 방법

### 방법 1: 로컬 환경 실행

1. **의존성 설치**
```bash
pip install -r requirements.txt
```

2. **서버 실행**
```bash
# 개발 모드 (자동 리로드)
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 프로덕션 모드
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

3. **브라우저에서 접속**
```
http://localhost:8000
```

### 방법 2: Docker 실행

1. **Docker 이미지 빌드**
```bash
docker build -t ai-status-dashboard .
```

2. **컨테이너 실행**
```bash
docker run -d --name ai-status-dashboard -p 8080:8000 ai-status-dashboard
```

### 방법 3: Docker Compose 실행 (권장)

1. **서비스 시작**
```bash
docker-compose up -d
```

2. **로그 확인**
```bash
docker-compose logs -f ai-status-dashboard
```

3. **서비스 중지**
```bash
docker-compose down
```

## 📡 API 엔드포인트

### REST API
- `GET /` - 메인 대시보드 페이지
- `GET /health` - 서버 헬스체크
- `GET /api/status` - 모든 AI 서비스 상태 조회

### WebSocket
- `WS /ws` - 실시간 상태 업데이트

## 🧪 테스트 실행

```bash
# 모든 테스트 실행
python -m pytest

# 커버리지와 함께 실행
python -m pytest --cov=app --cov-report=html

# 특정 테스트 파일 실행
python -m pytest tests/test_openai_service.py -v
```

## 📁 프로젝트 구조

```
ai-status-check/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI 애플리케이션
│   ├── config.py            # 설정 관리
│   ├── api/                 # API 라우터들
│   │   ├── __init__.py
│   │   ├── status.py        # 상태 API
│   │   └── websocket.py     # WebSocket 엔드포인트
│   ├── models/              # 데이터 모델
│   │   ├── __init__.py
│   │   └── status.py        # 상태 관련 모델
│   ├── services/            # 비즈니스 로직
│   │   ├── __init__.py
│   │   ├── base_service.py  # 기본 서비스 클래스
│   │   ├── openai_service.py    # OpenAI 상태 서비스
│   │   ├── anthropic_service.py # Anthropic 상태 서비스
│   │   ├── cursor_service.py    # Cursor 상태 서비스
│   │   └── status_service.py    # 통합 상태 서비스
│   ├── static/              # 정적 파일
│   │   ├── style.css        # 스타일시트
│   │   └── dashboard.js     # 프론트엔드 JavaScript
│   └── templates/           # HTML 템플릿
│       └── index.html       # 메인 페이지
├── tests/                   # 테스트 파일들
├── requirements.txt         # Python 의존성
├── Dockerfile              # Docker 이미지 정의
├── docker-compose.yml      # Docker Compose 설정
├── .dockerignore           # Docker 빌드 제외 파일
└── README.md               # 프로젝트 문서
```

## 🎯 사용법

1. **대시보드 접속**: 브라우저에서 `http://localhost:8000` 접속
2. **갱신 간격 설정**: 상단 컨트롤에서 원하는 갱신 간격 선택
3. **실시간 모니터링**: WebSocket을 통해 자동으로 상태 업데이트
4. **수동 새로고침**: 필요시 "수동 새로고침" 버튼 클릭

## 📊 상태 표시

- 🟢 **Operational**: 모든 시스템 정상 작동
- 🟡 **Degraded Performance**: 성능 저하 발생
- 🔴 **Partial/Major Outage**: 부분/전체 서비스 장애
- 🔵 **Under Maintenance**: 점검 중
- ⚫ **Unknown**: 상태 확인 불가

## 🐳 Docker 명령어 참고

```bash
# 이미지 빌드
docker build -t ai-status-dashboard .

# 컨테이너 실행
docker run -d --name ai-status-dashboard -p 8000:8000 ai-status-dashboard

# 로그 확인
docker logs -f ai-status-dashboard

# 컨테이너 정지
docker stop ai-status-dashboard

# 컨테이너 삭제
docker rm ai-status-dashboard

# 이미지 삭제
docker rmi ai-status-dashboard
```

## 🔧 환경변수

현재 이 애플리케이션은 외부 API 키가 필요하지 않으며, 모든 설정은 `app/config.py`에서 관리됩니다.

## 📝 개발 정보

- **개발 방법론**: MVC 패턴, TDD (테스트 주도 개발)
- **코드 품질**: Type hints, Docstrings, 단위 테스트
- **아키텍처**: 비동기 처리, 의존성 주입, 계층화된 구조

## 🤝 기여하기

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 라이선스

MIT License

---

> 💡 **Tip**: 개발 중에는 `--reload` 옵션을 사용하여 코드 변경 시 자동으로 서버가 재시작되도록 설정하세요!
