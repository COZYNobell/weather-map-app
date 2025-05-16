import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // 외부 API 요청용
import authRoutes from './routes/auth.mjs';
import favoriteRoutes from './routes/favorites.mjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 라우터 연결
app.use('/api', authRoutes);
app.use('/api/favorites', favoriteRoutes);

// 📍 위치 → 한글 주소 변환
app.get('/location', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.GOOGLE_API_KEY;

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&language=ko&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    const address = data.results?.[0]?.formatted_address || '주소 없음';
    res.json({ address });
  } catch (err) {
    console.error('❌ 주소 변환 실패:', err.message);
    res.status(500).json({ error: '주소 변환 실패' });
  }
});

// 🌤️ 오늘 날씨
app.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=kr&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    const weather = data.weather?.[0]?.description || '정보 없음';
    const icon = data.weather?.[0]?.icon || '';
    res.json({ weather, icon });
  } catch (err) {
    console.error('❌ 날씨 가져오기 실패:', err.message);
    res.status(500).json({ error: '날씨 가져오기 실패' });
  }
});

// 📅 5일 예보
app.get('/forecast', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=kr&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    const filtered = data.list
      .filter(item => item.dt_txt.includes('12:00:00'))
      .map(item => ({
        date: item.dt_txt.split(' ')[0],
        weather: item.weather?.[0]?.description || '',
        icon: item.weather?.[0]?.icon || '',
        temp: item.main?.temp
      }));

    res.json({ forecast: filtered });
  } catch (err) {
    console.error('❌ 예보 가져오기 실패:', err.message);
    res.status(500).json({ error: '예보 실패' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중! http://localhost:${PORT}`);
});

