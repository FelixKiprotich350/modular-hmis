import { Router } from 'express';
import { serviceRegistry } from '../../../../src/core/service-registry';

const router = Router();

router.get('/', async (req, res) => {
  const moduleManagerService = serviceRegistry.get('ModuleManagerService');
  const result = await moduleManagerService.getAllModules();
  res.json({ 
    message: 'All modules',
    ...result
  });
});

router.get('/core', async (req, res) => {
  const moduleManagerService = serviceRegistry.get('ModuleManagerService');
  const modules = await moduleManagerService.getCoreModules();
  res.json({ message: 'Core modules', modules });
});

router.get('/custom', async (req, res) => {
  const moduleManagerService = serviceRegistry.get('ModuleManagerService');
  const modules = await moduleManagerService.getCustomModules();
  res.json({ message: 'Custom modules', modules });
});

router.get('/:name/status', async (req, res) => {
  const { name } = req.params;
  const moduleManagerService = serviceRegistry.get('ModuleManagerService');
  const moduleInfo = await moduleManagerService.getModuleStatus(name);
  
  if (!moduleInfo) {
    return res.status(404).json({ error: 'Module not found' });
  }
  
  res.json(moduleInfo);
});

router.post('/:name/enable', async (req, res) => {
  const { name } = req.params;
  res.json({ message: `Module ${name} enabled` });
});

router.post('/:name/disable', async (req, res) => {
  const { name } = req.params;
  res.json({ message: `Module ${name} disabled` });
});

router.delete('/:name', async (req, res) => {
  const { name } = req.params;
  res.json({ message: `Module ${name} uninstalled` });
});

export default router;