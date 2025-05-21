#!/bin/bash

echo "🚀 CI/CD 자동 배포 시작..."

# 1. 디렉토리 이동
cd /home/ec2-user/weather-map-app || {
  echo "❌ 디렉토리 이동 실패!"
  exit 1
}

# 2. 기존 컨테이너 중지 및 삭제
echo "🧼 이전 컨테이너 정리 중..."
docker stop weather-map-app 2>/dev/null || true
docker rm weather-map-app 2>/dev/null || true

# 3. 최신 이미지 가져오기
echo "🐳 최신 이미지 pull 중..."
docker pull cozynobell/weather-map-app:latest || {
  echo "❌ 이미지 pull 실패"
  exit 1
}

# 4. 컨테이너 실행
echo "📦 컨테이너 실행 중..."
docker run -d \
  --name weather-map-app \
  -p 3000:3000 \
  --env-file /home/ec2-user/weather-map-app/.env \
  cozynobell/weather-map-app:latest || {
    echo "❌ 컨테이너 실행 실패"
    exit 1
  }

echo "✅ 배포 완료"

