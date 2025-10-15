import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  res.json({ message: 'Users API', users: [] });
});

router.post('/', async (req, res) => {
  res.json({ message: 'User created', user: req.body });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  res.json({ message: `User ${id}`, user: null });
});

export default router;