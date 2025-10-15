import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  res.json({ message: 'Patients API', patients: [] });
});

router.post('/', async (req, res) => {
  // Create patient logic here
  res.json({ message: 'Patient created', patient: req.body });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Patient ${id}`, patient: null });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Patient ${id} updated`, patient: req.body });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Patient ${id} deleted` });
});

export default router;