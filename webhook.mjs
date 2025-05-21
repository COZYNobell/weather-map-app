import express from 'express';
import { exec } from 'child_process';

const app = express();
const PORT = 4000;

// JSON 파싱 미들웨어
app.use(express.json());

// Webhook 엔드포인트
app.post('/webhook', (req, res) => {
  console.log("📩 Webhook 요청 수신됨! 배포 시작...");

  exec('bash /root/weather-map-app/deploy.sh', (err, stdout, stderr) => {
    if (err) {
      console.error("❌ 배포 실패:", stderr);
      return res.status(500).send('Deploy failed');
    }

    console.log("✅ 배포 완료:", stdout);
    res.send('OK');
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Webhook 서버 실행 중: http://localhost:${PORT}`);
});

