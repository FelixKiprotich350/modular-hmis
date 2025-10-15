import { Router } from 'express';
import { serviceRegistry } from '../../../../src/core/service-registry';
import { authenticateToken, requirePrivileges, requireRole, AuthenticatedRequest } from '../../../../src/core/auth-middleware';
import bcrypt from 'bcrypt';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const userService = serviceRegistry.get('UserService');
    const auditService = serviceRegistry.get('AuditService');
    
    const user = await userService.createUser({
      username,
      email,
      password,
      firstName,
      lastName
    });

    await auditService.log({
      action: 'USER_CREATED',
      resource: 'users',
      userId: user.id,
      details: { username, email }
    });

    res.status(201).json({ message: 'User created successfully', user: { id: user.id, username, email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', authenticateToken, requirePrivileges(['View Users']), async (req, res) => {
  try {
    const userService = serviceRegistry.get('UserService');
    const users = await userService.listUsers();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authenticateToken, requirePrivileges(['View Users']), async (req, res) => {
  try {
    const { id } = req.params;
    const userService = serviceRegistry.get('UserService');
    const user = await userService.getUser(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticateToken, requirePrivileges(['Edit Users']), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { email, firstName, lastName } = req.body;
    
    const userService = serviceRegistry.get('UserService');
    const auditService = serviceRegistry.get('AuditService');
    
    const updatedUser = await userService.updateUser(id, { email, firstName, lastName });
    
    await auditService.log({
      action: 'USER_UPDATED',
      resource: 'users',
      userId: req.user!.id,
      details: { targetUserId: id, updatedFields: Object.keys(req.body) }
    });
    
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, requirePrivileges(['Delete Users']), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    
    const userService = serviceRegistry.get('UserService');
    const auditService = serviceRegistry.get('AuditService');
    
    await userService.deleteUser(id);
    
    await auditService.log({
      action: 'USER_DELETED',
      resource: 'users',
      userId: req.user!.id,
      details: { targetUserId: id }
    });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;