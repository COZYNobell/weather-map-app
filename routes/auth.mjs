import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db/connect.mjs';

const router = express.Router();

// ✅ 회원가입 API
router.post('/signup', express.json(), async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: '이메일과 비밀번호를 모두 입력하세요.' });
  }

  try {
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: '이미 가입된 이메일입니다.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashed]);

    res.status(201).json({ message: '회원가입 성공!' });
  } catch (err) {
    console.error('❌ 회원가입 오류:', err.message);
    res.status(500).json({ error: '서버 오류' });
  }
});

// ✅ 로그인 API + JWT 발급
router.post('/login', express.json(), async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' });
  }

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: '존재하지 않는 계정입니다.' });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: '비밀번호가 틀렸습니다.' });
    }

    // ✅ JWT 발급
    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.json({ message: '로그인 성공!', token, email: user.email });
  } catch (err) {
    console.error('❌ 로그인 오류:', err.message);
    res.status(500).json({ error: '서버 오류' });
  }
});

export default router;

