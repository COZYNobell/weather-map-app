import express from 'express';
import db from '../db/connect.mjs';

const router = express.Router();

// 즐겨찾기 저장
router.post('/', express.json(), async (req, res) => {
  const { email, lat, lon } = req.body;

  if (!email || !lat || !lon) {
    return res.status(400).json({ error: '입력값 누락' });
  }

  try {
    await db.query(
      'INSERT INTO favorites (email, lat, lon) VALUES (?, ?, ?)',
      [email, lat, lon]
    );
    res.json({ message: '즐겨찾기 저장 완료!' });
  } catch (err) {
    console.error('❌ DB 저장 실패:', err.message);
    res.status(500).json({ error: 'DB 오류' });
  }
});

export default router;

