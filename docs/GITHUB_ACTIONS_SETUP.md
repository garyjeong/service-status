# GitHub Actions ECR 배포 설정 가이드

## 1. GitHub Repository Secrets 설정

GitHub 리포지토리 → Settings → Secrets and variables → Actions에서 다음 secrets를 추가하세요:

```
AWS_ACCESS_KEY_ID = your-aws-access-key-id
AWS_SECRET_ACCESS_KEY = your-aws-secret-access-key
```

> ⚠️ **보안 주의사항**:
>
> - AWS 액세스 키는 ECR 권한만 부여된 IAM 사용자로 생성하세요
> - `AmazonEC2ContainerRegistryFullAccess` 정책을 권장합니다

## 2. AWS ECR 리포지토리 생성

```bash
# ECR 리포지토리 생성 (최초 1회만)
aws ecr create-repository \
  --repository-name service-status \
  --region ap-northeast-2

# 리포지토리 정책 설정 (선택사항)
aws ecr set-repository-policy \
  --repository-name service-status \
  --policy-text file://ecr-policy.json \
  --region ap-northeast-2
```

## 3. 워크플로우 동작 방식

### 트리거 조건

- `main` 또는 `master` 브랜치에 push
- `main` 또는 `master` 브랜치로의 Pull Request

### 생성되는 이미지 태그

- `latest`: 항상 최신 버전
- `<git-commit-sha>`: 특정 커밋의 고유 버전

### 예시

```
014125597282.dkr.ecr.ap-northeast-2.amazonaws.com/service-status:latest
014125597282.dkr.ecr.ap-northeast-2.amazonaws.com/service-status:a1b2c3d4
```

## 4. 배포 확인 방법

```bash
# ECR 이미지 목록 확인
aws ecr describe-images \
  --repository-name service-status \
  --region ap-northeast-2

# 특정 태그 확인
aws ecr describe-images \
  --repository-name service-status \
  --image-ids imageTag=latest \
  --region ap-northeast-2
```

## 5. 로컬 테스트

```bash
# 로컬에서 Docker 빌드 테스트
docker build -t service-status:test .

# 컨테이너 실행 테스트
docker run -p 8080:80 service-status:test
```

## 6. 문제 해결

### 권한 오류

```
Error: The user-provided path does not exist
```

→ AWS 액세스 키의 ECR 권한을 확인하세요

### 빌드 실패

```
Error: Cannot connect to the Docker daemon
```

→ Dockerfile 문법을 확인하고 로컬에서 먼저 테스트하세요

### ECR 로그인 실패

```
Error: Cannot perform an interactive login from a non TTY device
```

→ AWS 리전과 리포지토리 이름을 확인하세요

## 7. 고급 설정

### 멀티 아키텍처 빌드

```yaml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3

- name: Build and push multi-platform image
  uses: docker/build-push-action@v5
  with:
    context: .
    platforms: linux/amd64,linux/arm64
    push: true
    tags: |
      ${{ steps.login-ecr.outputs.registry }}/service-status:latest
      ${{ steps.login-ecr.outputs.registry }}/service-status:${{ github.sha }}
```

### 캐시 최적화

```yaml
- name: Build with cache
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: ${{ steps.login-ecr.outputs.registry }}/service-status:latest
    cache-from: type=gha
    cache-to: type=gha,mode=max
```
