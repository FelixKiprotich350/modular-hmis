import { Router } from 'express';

const router = Router();

router.get('/orders', async (req, res) => {
  res.json({ message: 'Lab orders', orders: [] });
});

router.post('/orders', async (req, res) => {
  res.json({ message: 'Lab order created', order: req.body });
});

router.get('/results', async (req, res) => {
  res.json({ message: 'Lab results', results: [] });
});

router.post('/results', async (req, res) => {
  res.json({ message: 'Lab result recorded', result: req.body });
});

router.get('/tests', async (req, res) => {
  res.json({ message: 'Available tests', tests: [] });
});

export default router;