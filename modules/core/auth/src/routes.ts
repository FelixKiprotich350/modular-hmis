import { Router } from 'express';

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  res.json({ message: 'Login successful', token: 'jwt-token', user: { username } });
});

router.post('/logout', async (req, res) => {
  res.json({ message: 'Logout successful' });
});

router.post('/refresh', async (req, res) => {
  res.json({ message: 'Token refreshed', token: 'new-jwt-token' });
});

router.post('/reset-password', async (req, res) => {
  const { email } = req.body;
  res.json({ message: 'Password reset email sent', email });
});

export default router;