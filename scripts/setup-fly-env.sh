#!/bin/bash

# Fly.io 환경 변수 설정 스크립트
# 사용법: ./scripts/setup-fly-env.sh

set -e

APP_NAME="service-status"

echo "🚀 Fly.io 환경 변수 설정 시작..."

# service-status는 정적 사이트이므로 특별한 환경 변수가 필요하지 않습니다.
# 필요시 여기에 환경 변수 설정을 추가하세요.

echo ""
echo "✅ 환경 변수 설정 완료!"
echo ""
echo "📋 현재 설정된 환경 변수:"
fly secrets list --app "$APP_NAME" || echo "⚠️  환경 변수가 설정되지 않았습니다."

echo ""
echo "🔄 앱을 재시작하세요:"
echo "   fly apps restart $APP_NAME"
