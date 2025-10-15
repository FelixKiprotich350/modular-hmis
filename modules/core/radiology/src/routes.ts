import { Router } from 'express';

const router = Router();

router.get('/orders', async (req, res) => {
  res.json({ message: 'Radiology orders', orders: [] });
});

router.post('/orders', async (req, res) => {
  res.json({ message: 'Radiology order created', order: req.body });
});

router.get('/reports', async (req, res) => {
  res.json({ message: 'Radiology reports', reports: [] });
});

router.post('/reports', async (req, res) => {
  res.json({ message: 'Radiology report created', report: req.body });
});

router.get('/studies', async (req, res) => {
  res.json({ message: 'Radiology studies', studies: [] });
});

export default router;