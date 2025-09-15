#!/bin/bash

# 🚀 Service Status HTTPS 인프라 자동 구성 스크립트
# 빌게이츠를 위한 긴급 HTTPS 문제 해결!

set -e

# 설정 변수
DOMAIN="service-status.garyzone.pro"
CLUSTER_NAME="service-status-cluster"
SERVICE_NAME="service-status-service"
TASK_FAMILY="service-status"
ECR_REPO="014125597282.dkr.ecr.ap-northeast-2.amazonaws.com/service-status"
REGION="ap-northeast-2"

echo "🔥 빌게이츠를 위한 HTTPS 긴급 복구 시작!"
echo "🎯 도메인: $DOMAIN"

# 1. VPC 및 서브넷 정보 가져오기
echo "📡 VPC 정보 수집 중..."
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=is-default,Values=true" --query 'Vpcs[0].VpcId' --output text --region $REGION)
SUBNET_IDS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" "Name=default-for-az,Values=true" --query 'Subnets[].SubnetId' --output text --region $REGION)
SUBNET_ARRAY=($SUBNET_IDS)

echo "✅ VPC ID: $VPC_ID"
echo "✅ 서브넷: ${SUBNET_ARRAY[@]}"

# 2. 보안 그룹 생성 (ALB용)
echo "🛡️ ALB 보안 그룹 생성 중..."
ALB_SG_ID=$(aws ec2 create-security-group \
    --group-name service-status-alb-sg \
    --description "Service Status ALB Security Group" \
    --vpc-id $VPC_ID \
    --region $REGION \
    --query 'GroupId' --output text 2>/dev/null || \
    aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=service-status-alb-sg" \
    --query 'SecurityGroups[0].GroupId' --output text --region $REGION)

# HTTP/HTTPS 인바운드 규칙 추가
aws ec2 authorize-security-group-ingress \
    --group-id $ALB_SG_ID \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0 \
    --region $REGION 2>/dev/null || true

aws ec2 authorize-security-group-ingress \
    --group-id $ALB_SG_ID \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0 \
    --region $REGION 2>/dev/null || true

echo "✅ ALB 보안 그룹: $ALB_SG_ID"

# 3. ECS 태스크용 보안 그룹 생성
echo "🛡️ ECS 태스크 보안 그룹 생성 중..."
ECS_SG_ID=$(aws ec2 create-security-group \
    --group-name service-status-ecs-sg \
    --description "Service Status ECS Tasks Security Group" \
    --vpc-id $VPC_ID \
    --region $REGION \
    --query 'GroupId' --output text 2>/dev/null || \
    aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=service-status-ecs-sg" \
    --query 'SecurityGroups[0].GroupId' --output text --region $REGION)

# ALB에서 ECS로 트래픽 허용
aws ec2 authorize-security-group-ingress \
    --group-id $ECS_SG_ID \
    --protocol tcp \
    --port 80 \
    --source-group $ALB_SG_ID \
    --region $REGION 2>/dev/null || true

echo "✅ ECS 보안 그룹: $ECS_SG_ID"

# 4. SSL 인증서 요청 (ACM)
echo "🔐 SSL 인증서 요청 중..."
CERT_ARN=$(aws acm request-certificate \
    --domain-name $DOMAIN \
    --validation-method DNS \
    --region $REGION \
    --query 'CertificateArn' --output text 2>/dev/null || \
    aws acm list-certificates \
    --certificate-statuses ISSUED PENDING_VALIDATION \
    --query "CertificateSummaryList[?DomainName=='$DOMAIN'].CertificateArn" \
    --output text --region $REGION | head -1)

echo "✅ SSL 인증서: $CERT_ARN"

# 5. ALB 생성
echo "⚖️ Application Load Balancer 생성 중..."
ALB_ARN=$(aws elbv2 create-load-balancer \
    --name service-status-alb \
    --subnets ${SUBNET_ARRAY[@]} \
    --security-groups $ALB_SG_ID \
    --region $REGION \
    --query 'LoadBalancers[0].LoadBalancerArn' --output text 2>/dev/null || \
    aws elbv2 describe-load-balancers \
    --names service-status-alb \
    --query 'LoadBalancers[0].LoadBalancerArn' --output text --region $REGION)

ALB_DNS=$(aws elbv2 describe-load-balancers \
    --load-balancer-arns $ALB_ARN \
    --query 'LoadBalancers[0].DNSName' --output text --region $REGION)

echo "✅ ALB ARN: $ALB_ARN"
echo "✅ ALB DNS: $ALB_DNS"

# 6. 대상 그룹 생성
echo "🎯 대상 그룹 생성 중..."
TG_ARN=$(aws elbv2 create-target-group \
    --name service-status-tg \
    --protocol HTTP \
    --port 80 \
    --vpc-id $VPC_ID \
    --target-type ip \
    --health-check-path /health \
    --health-check-interval-seconds 30 \
    --health-check-timeout-seconds 5 \
    --healthy-threshold-count 2 \
    --unhealthy-threshold-count 3 \
    --region $REGION \
    --query 'TargetGroups[0].TargetGroupArn' --output text 2>/dev/null || \
    aws elbv2 describe-target-groups \
    --names service-status-tg \
    --query 'TargetGroups[0].TargetGroupArn' --output text --region $REGION)

echo "✅ 대상 그룹: $TG_ARN"

# 7. HTTP 리스너 생성 (HTTPS로 리다이렉트)
echo "🔀 HTTP 리스너 생성 중..."
aws elbv2 create-listener \
    --load-balancer-arn $ALB_ARN \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=redirect,RedirectConfig='{Protocol=HTTPS,Port=443,StatusCode=HTTP_301}' \
    --region $REGION 2>/dev/null || true

# 8. HTTPS 리스너 생성
echo "🔒 HTTPS 리스너 생성 중..."
if [ "$CERT_ARN" != "None" ] && [ ! -z "$CERT_ARN" ]; then
    aws elbv2 create-listener \
        --load-balancer-arn $ALB_ARN \
        --protocol HTTPS \
        --port 443 \
        --certificates CertificateArn=$CERT_ARN \
        --default-actions Type=forward,TargetGroupArn=$TG_ARN \
        --region $REGION 2>/dev/null || true
    echo "✅ HTTPS 리스너 생성 완료"
else
    echo "⚠️ SSL 인증서가 아직 발급되지 않았습니다. 수동으로 DNS 검증 후 리스너를 생성해주세요."
fi

# 9. ECS 클러스터 생성
echo "🏗️ ECS 클러스터 생성 중..."
aws ecs create-cluster \
    --cluster-name $CLUSTER_NAME \
    --capacity-providers FARGATE \
    --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1 \
    --region $REGION 2>/dev/null || true

# 10. CloudWatch 로그 그룹 생성
echo "📊 CloudWatch 로그 그룹 생성 중..."
aws logs create-log-group \
    --log-group-name /ecs/service-status \
    --region $REGION 2>/dev/null || true

# 11. Task Definition 업데이트 및 등록
echo "📋 Task Definition 업데이트 중..."
cat > /tmp/task-definition.json << EOF
{
  "family": "$TASK_FAMILY",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::014125597282:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "service-status",
      "image": "$ECR_REPO:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/service-status",
          "awslogs-region": "$REGION",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": [
          "CMD-SHELL",
          "curl -f http://localhost/health || exit 1"
        ],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
EOF

TASK_DEF_ARN=$(aws ecs register-task-definition \
    --cli-input-json file:///tmp/task-definition.json \
    --region $REGION \
    --query 'taskDefinition.taskDefinitionArn' --output text)

echo "✅ Task Definition: $TASK_DEF_ARN"

# 12. ECS 서비스 생성/업데이트
echo "🚀 ECS 서비스 배포 중..."
aws ecs create-service \
    --cluster $CLUSTER_NAME \
    --service-name $SERVICE_NAME \
    --task-definition $TASK_FAMILY \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[${SUBNET_ARRAY[0]},${SUBNET_ARRAY[1]}],securityGroups=[$ECS_SG_ID],assignPublicIp=ENABLED}" \
    --load-balancers targetGroupArn=$TG_ARN,containerName=service-status,containerPort=80 \
    --region $REGION 2>/dev/null || \
aws ecs update-service \
    --cluster $CLUSTER_NAME \
    --service $SERVICE_NAME \
    --task-definition $TASK_FAMILY \
    --region $REGION

echo ""
echo "🎉 HTTPS 인프라 구성 완료!"
echo ""
echo "📋 다음 단계:"
echo "1. SSL 인증서 DNS 검증:"
echo "   - ACM 콘솔에서 $CERT_ARN 확인"
echo "   - 제공된 CNAME 레코드를 Route53에 추가"
echo ""
echo "2. Route53 A 레코드 설정:"
echo "   - $DOMAIN → $ALB_DNS"
echo ""
echo "3. 서비스 상태 확인:"
echo "   - aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $REGION"
echo ""
echo "🔥 빌게이츠를 위한 HTTPS 복구 작전 완료!"
