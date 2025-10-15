import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  res.json({ message: 'Observations API', observations: [] });
});

router.post('/', async (req, res) => {
  res.json({ message: 'Observation created', observation: req.body });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Observation ${id}`, observation: null });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Observation ${id} updated`, observation: req.body });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Observation ${id} deleted` });
});

export default router;