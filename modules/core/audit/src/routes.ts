import { Router } from 'express';
import { serviceRegistry } from '../../../../src/core/service-registry';

const router = Router();

router.get('/logs', async (req, res) => {
  try {
    const { page, limit, action, userId, resource, startDate, endDate } = req.query;
    
    const filters: any = {};
    if (page) filters.page = Number(page);
    if (limit) filters.limit = Number(limit);
    if (action) filters.action = action as string;
    if (userId) filters.userId = userId as string;
    if (resource) filters.resource = resource as string;
    if (startDate) filters.startDate = new Date(startDate as string);
    if (endDate) filters.endDate = new Date(endDate as string);

    const auditService = serviceRegistry.get('AuditService');
    const result = await auditService.getLogs(filters);
    
    res.json({
      message: 'Audit logs retrieved',
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/logs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const auditService = serviceRegistry.get('AuditService');
    const log = await auditService.getLog(id);
    
    if (!log) {
      return res.status(404).json({ error: 'Audit log not found' });
    }
    
    res.json({ log });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/logs', async (req, res) => {
  try {
    const { action, resource, userId, details } = req.body;
    
    if (!action || !resource || !userId) {
      return res.status(400).json({ error: 'Action, resource, and userId are required' });
    }

    const auditService = serviceRegistry.get('AuditService');
    const logId = await auditService.log({
      action,
      resource,
      userId,
      details,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.status(201).json({ message: 'Audit log created', logId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/export', async (req, res) => {
  try {
    const { startDate, endDate, format = 'csv' } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const auditService = serviceRegistry.get('AuditService');
    const result = await auditService.exportLogs(
      new Date(startDate as string),
      new Date(endDate as string),
      format as string
    );
    
    res.json({ message: 'Audit export initiated', ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;