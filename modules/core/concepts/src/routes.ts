import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  res.json({ message: 'Concepts API', concepts: [] });
});

router.post('/', async (req, res) => {
  res.json({ message: 'Concept created', concept: req.body });
});

export default router;