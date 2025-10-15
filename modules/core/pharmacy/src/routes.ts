import { Router } from 'express';

const router = Router();

router.get('/prescriptions', async (req, res) => {
  res.json({ message: 'Prescriptions', prescriptions: [] });
});

router.post('/prescriptions', async (req, res) => {
  res.json({ message: 'Prescription created', prescription: req.body });
});

router.get('/medications', async (req, res) => {
  res.json({ message: 'Medications', medications: [] });
});

router.post('/dispense', async (req, res) => {
  res.json({ message: 'Medication dispensed', dispensing: req.body });
});

router.get('/inventory', async (req, res) => {
  res.json({ message: 'Pharmacy inventory', inventory: [] });
});

export default router;