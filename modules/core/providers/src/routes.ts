import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  res.json({ message: 'Providers API', providers: [] });
});

router.post('/', async (req, res) => {
  res.json({ message: 'Provider created', provider: req.body });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Provider ${id}`, provider: null });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Provider ${id} updated`, provider: req.body });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Provider ${id} deleted` });
});

export default router;