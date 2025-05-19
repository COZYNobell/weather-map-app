#!/bin/bash

# 최신 이미지 pull
docker pull cozynobell/weather-map-app:latest

# 기존 컨테이너 중지 및 제거
docker stop weather-app || true
docker rm weather-app || true

# 새 컨테이너 실행
docker run -d --name weather-app \
  --network host \
  --env-file /root/weather-map-app/.env \
  cozynobell/weather-map-app:latest

