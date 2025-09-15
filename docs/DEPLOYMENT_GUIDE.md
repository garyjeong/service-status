# 🚀 배포 가이드 - service-status.garyzone.pro

## 🚨 현재 문제 및 해결 방안

### 문제 진단
- ❌ **HTTPS 접근 실패**: SSL 인증서 또는 HTTPS 리스너 부재
- ❌ **HTTP 빈 화면**: nginx 설정 또는 컨테이너 실행 문제

### 해결된 설정
- ✅ **도메인 설정**: `service-status.garyzone.pro` 추가
- ✅ **HTTPS 리다이렉트**: 프록시 뒤에서 자동 HTTPS 전환
- ✅ **보안 헤더**: HSTS, CSP 등 보안 강화
- ✅ **에러 페이지**: 사용자 친화적 5xx 에러 페이지

## 🏗️ 권장 배포 아키텍처

### 옵션 1: AWS ALB + ECS Fargate (권장)
```
Internet → Route53 → ALB (HTTPS) → ECS Service → ECR Image
```

**장점**:
- 자동 SSL 인증서 (ACM)
- 자동 스케일링
- 헬스체크 및 로드밸런싱
- 관리형 서비스

### 옵션 2: Cloudflare + 단일 서버
```
Internet → Cloudflare (HTTPS) → Origin Server (HTTP)
```

**장점**:
- 무료 SSL
- CDN 및 DDoS 보호
- 간단한 설정

## 📋 배포 단계

### 1단계: ECR 이미지 확인
```bash
# 최신 이미지 확인
aws ecr describe-images \
  --repository-name service-status \
  --region ap-northeast-2 \
  --query 'imageDetails[0].imageTags'
```

### 2단계: ECS 클러스터 생성 (최초 1회)
```bash
# 클러스터 생성
aws ecs create-cluster \
  --cluster-name service-status-cluster \
  --capacity-providers FARGATE \
  --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1

# 로그 그룹 생성
aws logs create-log-group \
  --log-group-name /ecs/service-status \
  --region ap-northeast-2
```

### 3단계: ALB 생성 및 설정
```bash
# VPC 및 서브넷 정보 확인
aws ec2 describe-vpcs --query 'Vpcs[?IsDefault==`true`].VpcId' --output text
aws ec2 describe-subnets --filters "Name=default-for-az,Values=true" --query 'Subnets[].SubnetId' --output text

# 보안 그룹 생성
aws ec2 create-security-group \
  --group-name service-status-alb-sg \
  --description "Security group for Service Status ALB" \
  --vpc-id vpc-xxxxxxxx

# ALB 생성
aws elbv2 create-load-balancer \
  --name service-status-alb \
  --subnets subnet-xxxxxxxx subnet-yyyyyyyy \
  --security-groups sg-xxxxxxxx
```

### 4단계: ECS 서비스 배포
```bash
# Task Definition 등록
aws ecs register-task-definition \
  --cli-input-json file://aws-ecs-task-definition.json

# 서비스 생성
aws ecs create-service \
  --cluster service-status-cluster \
  --service-name service-status-service \
  --task-definition service-status:1 \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxxxxx],securityGroups=[sg-xxxxxxxx],assignPublicIp=ENABLED}"
```

### 5단계: 도메인 연결
```bash
# Route53에서 A 레코드 생성
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "service-status.garyzone.pro",
        "Type": "A",
        "AliasTarget": {
          "DNSName": "alb-dns-name.region.elb.amazonaws.com",
          "EvaluateTargetHealth": true,
          "HostedZoneId": "ALB-HOSTED-ZONE-ID"
        }
      }
    }]
  }'
```

## 🔧 빠른 수정 (현재 환경)

현재 실행 중인 컨테이너가 있다면:

### Docker 컨테이너 재시작
```bash
# 현재 컨테이너 중지
docker stop service-status

# 새 이미지로 실행
docker run -d \
  --name service-status \
  -p 80:80 \
  014125597282.dkr.ecr.ap-northeast-2.amazonaws.com/service-status:latest
```

### nginx 설정 확인
```bash
# 컨테이너 내부 확인
docker exec -it service-status nginx -t
docker exec -it service-status nginx -s reload
```

## 🔍 문제 해결

### HTTPS 접근 실패
1. **SSL 인증서 확인**: ACM 또는 Let's Encrypt 설정
2. **ALB 리스너 확인**: 443 포트 HTTPS 리스너 존재 여부
3. **보안 그룹 확인**: 443 포트 인바운드 규칙

### HTTP 빈 화면
1. **컨테이너 상태 확인**: `docker ps`, `docker logs`
2. **헬스체크 확인**: `/health` 엔드포인트 응답
3. **nginx 설정 확인**: 문법 오류 여부

### 로그 확인
```bash
# ECS 로그 확인
aws logs get-log-events \
  --log-group-name /ecs/service-status \
  --log-stream-name ecs/service-status/task-id

# 컨테이너 로그 확인
docker logs service-status
```

## 📞 긴급 복구

문제가 지속될 경우:

1. **롤백**: 이전 안정 버전으로 복구
2. **헬스체크 비활성화**: 임시로 트래픽 허용
3. **직접 IP 접근**: ALB 우회하여 컨테이너 직접 접근

```bash
# 긴급 롤백
aws ecs update-service \
  --cluster service-status-cluster \
  --service service-status-service \
  --task-definition service-status:previous-version
```
