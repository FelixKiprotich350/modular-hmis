import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  res.json({ message: 'System settings', settings: {} });
});

router.get('/:category', async (req, res) => {
  const { category } = req.params;
  res.json({ message: `${category} settings`, settings: {} });
});

router.put('/:category', async (req, res) => {
  const { category } = req.params;
  res.json({ message: `${category} settings updated`, settings: req.body });
});

router.get('/facility/:facilityId', async (req, res) => {
  const { facilityId } = req.params;
  res.json({ message: `Facility ${facilityId} settings`, settings: {} });
});

router.put('/facility/:facilityId', async (req, res) => {
  const { facilityId } = req.params;
  res.json({ message: `Facility ${facilityId} settings updated`, settings: req.body });
});

export default router;