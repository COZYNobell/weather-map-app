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
    // 사용자 ID 조회
    const [users] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ error: '사용자 없음' });
    }

    const userId = users[0].id;

    // 즐겨찾기 저장
    await db.query(
      'INSERT INTO favorites (user_id, lat, lon) VALUES (?, ?, ?)',
      [userId, lat, lon]
    );

    res.json({ message: '즐겨찾기 저장 완료!' });
  } catch (err) {
    console.error('❌ DB 저장 실패:', err.message);
    res.status(500).json({ error: 'DB 오류' });
  }
});

export default router;

