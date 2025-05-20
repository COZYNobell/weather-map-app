// ✅ webhook.mjs — GitHub Webhook 수신 서버
import http from 'http';
import { exec } from 'child_process';

const PORT = 4000;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook') {
    console.log('📩 Webhook 요청 수신됨! 배포 시작...');

    exec('sh deploy.sh', (err, stdout, stderr) => {
      if (err) {
        console.error('❌ 배포 실패:', stderr);
        res.writeHead(500);
        res.end('Deploy failed');
        return;
      }

      console.log('✅ 배포 완료:', stdout);
      res.writeHead(200);
      res.end('Deployed successfully');
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Webhook 서버 실행 중: http://localhost:${PORT}`);
});


// ✅ deploy.sh — GitHub Push 후 자동 배포 실행 스크립트
// 실행 권한 부여 필요: chmod +x deploy.sh

// #!/bin/bash
// cd ~/weather-map-app
// echo "📥 최신 코드 Pull 중..."
// git pull

// echo "📦 의존성 설치 중..."
// npm install

// echo "🔄 서버 재시작 중..."
// pkill node
// nohup node server.mjs > app.log 2>&1 &

