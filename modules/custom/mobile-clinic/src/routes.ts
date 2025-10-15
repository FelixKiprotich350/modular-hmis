import { Router } from 'express';

const router = Router();

router.get('/schedules', async (req, res) => {
  res.json({ message: 'Mobile clinic schedules', schedules: [] });
});

router.post('/schedules', async (req, res) => {
  res.json({ message: 'Mobile clinic schedule created', schedule: req.body });
});

router.get('/locations', async (req, res) => {
  res.json({ message: 'Mobile clinic locations', locations: [] });
});

router.post('/sync', async (req, res) => {
  res.json({ message: 'Data synchronized', sync: req.body });
});

router.get('/offline-data', async (req, res) => {
  res.json({ message: 'Offline data', data: [] });
});

export default router;