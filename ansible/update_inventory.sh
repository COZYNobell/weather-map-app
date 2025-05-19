#!/bin/bash

EC2_IP=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=weather-map" \
  --query "Reservations[*].Instances[*].PublicIpAddress" \
  --output text)

if [ -z "$EC2_IP" ]; then
  echo "❌ EC2 IP를 가져올 수 없습니다. 인스턴스가 실행 중인지 확인하세요."
  exit 1
fi

echo "[ec2]" > inventory.ini
echo "$EC2_IP ansible_user=ec2-user ansible_ssh_private_key_file=~/.ssh/my-key.pem" >> inventory.ini

echo "✅ inventory.ini 갱신 완료: $EC2_IP"

