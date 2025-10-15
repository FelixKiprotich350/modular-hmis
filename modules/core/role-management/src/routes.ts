import { Router } from 'express';
import { serviceRegistry } from '../../../../src/core/service-registry';
import { authenticateToken, requirePrivileges, AuthenticatedRequest } from '../../../../src/core/auth-middleware';

const router = Router();

// User role management
router.post('/users/:id/roles', authenticateToken, requirePrivileges(['Assign Roles']), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { roleName } = req.body;
    
    if (!roleName) {
      return res.status(400).json({ error: 'Role name is required' });
    }

    const privilegeService = serviceRegistry.get('PrivilegeService');
    const auditService = serviceRegistry.get('AuditService');
    
    await privilegeService.assignRoleToUser(id, roleName);
    
    await auditService.log({
      action: 'ROLE_ASSIGNED',
      resource: 'roles',
      userId: req.user!.id,
      details: { targetUserId: id, roleName }
    });
    
    res.json({ message: `Role '${roleName}' assigned to user` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/users/:id/roles/:roleName', authenticateToken, requirePrivileges(['Remove Roles']), async (req: AuthenticatedRequest, res) => {
  try {
    const { id, roleName } = req.params;
    
    const privilegeService = serviceRegistry.get('PrivilegeService');
    const auditService = serviceRegistry.get('AuditService');
    
    await privilegeService.removeRoleFromUser(id, roleName);
    
    await auditService.log({
      action: 'ROLE_REMOVED',
      resource: 'roles',
      userId: req.user!.id,
      details: { targetUserId: id, roleName }
    });
    
    res.json({ message: `Role '${roleName}' removed from user` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/users/:id', authenticateToken, requirePrivileges(['View Roles']), async (req, res) => {
  try {
    const { id } = req.params;
    const privilegeService = serviceRegistry.get('PrivilegeService');
    
    const privileges = await privilegeService.getUserPrivileges(id);
    const roles = await privilegeService.getUserRoles(id);
    
    res.json({ userId: id, privileges, roles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Role management
router.get('/', authenticateToken, requirePrivileges(['View Roles']), async (req, res) => {
  try {
    const roleService = serviceRegistry.get('RoleManagementService');
    const roles = await roleService.getAllRoles();
    res.json({ roles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:roleName/privileges', authenticateToken, requirePrivileges(['View Roles']), async (req, res) => {
  try {
    const { roleName } = req.params;
    const roleService = serviceRegistry.get('RoleManagementService');
    const privileges = await roleService.getRolePrivileges(roleName);
    res.json({ role: roleName, privileges });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;