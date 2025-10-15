import { Router } from 'express';

const router = Router();

router.get('/invoices', async (req, res) => {
  res.json({ message: 'Invoices', invoices: [] });
});

router.post('/invoices', async (req, res) => {
  res.json({ message: 'Invoice created', invoice: req.body });
});

router.get('/payments', async (req, res) => {
  res.json({ message: 'Payments', payments: [] });
});

router.post('/payments', async (req, res) => {
  res.json({ message: 'Payment recorded', payment: req.body });
});

router.get('/charges', async (req, res) => {
  res.json({ message: 'Charges', charges: [] });
});

export default router;