#!/bin/bash
cd /home/ec2-user/weather-map-app

docker stop weather-map-app || true
docker rm weather-map-app || true

docker pull cozynobell/weather-map-app:latest
docker run -d \
  --name weather-map-app \
  -p 3000:3000 \
  --env-file /home/ec2-user/weather-map-app/.env \
  cozynobell/weather-map-app:latest

