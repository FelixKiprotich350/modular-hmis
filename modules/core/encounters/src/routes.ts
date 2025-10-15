import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  res.json({ message: 'Encounters API', encounters: [] });
});

router.post('/', async (req, res) => {
  res.json({ message: 'Encounter created', encounter: req.body });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Encounter ${id}`, encounter: null });
});

router.get('/patient/:patientId', async (req, res) => {
  const { patientId } = req.params;
  res.json({ message: `Encounters for patient ${patientId}`, encounters: [] });
});

export default router;