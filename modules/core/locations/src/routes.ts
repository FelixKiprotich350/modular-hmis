import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  res.json({ message: 'Locations API', locations: [] });
});

router.post('/', async (req, res) => {
  res.json({ message: 'Location created', location: req.body });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Location ${id}`, location: null });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Location ${id} updated`, location: req.body });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Location ${id} deleted` });
});

export default router;