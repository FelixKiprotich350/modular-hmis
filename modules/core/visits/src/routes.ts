import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  res.json({ message: 'Visits API', visits: [] });
});

router.post('/', async (req, res) => {
  res.json({ message: 'Visit created', visit: req.body });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Visit ${id}`, visit: null });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Visit ${id} updated`, visit: req.body });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Visit ${id} deleted` });
});

router.get('/patient/:patientId', async (req, res) => {
  const { patientId } = req.params;
  res.json({ message: `Visits for patient ${patientId}`, visits: [] });
});

export default router;