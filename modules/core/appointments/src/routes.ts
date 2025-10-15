import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  res.json({ message: 'Appointments API', appointments: [] });
});

router.post('/', async (req, res) => {
  res.json({ message: 'Appointment created', appointment: req.body });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Appointment ${id}`, appointment: null });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Appointment ${id} updated`, appointment: req.body });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Appointment ${id} deleted` });
});

export default router;