import { Router } from 'express';
import { serviceRegistry } from '../../../../src/core/service-registry';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const authService = serviceRegistry.get('AuthService');
    const auditService = serviceRegistry.get('AuditService');
    
    const result = await authService.login(username, password);
    
    await auditService.log({
      action: 'USER_LOGIN',
      resource: 'auth',
      userId: result.user.id,
      details: { username },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      message: 'Login successful',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    const auditService = serviceRegistry.get('AuditService');
    await auditService.log({
      action: 'LOGIN_FAILED',
      resource: 'auth',
      userId: 'unknown',
      details: { username: req.body.username, error: error.message },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.status(401).json({ error: error.message });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const authService = serviceRegistry.get('AuthService');
    const auditService = serviceRegistry.get('AuditService');
    
    if (token) {
      const decoded = jwt.decode(token) as any;
      if (decoded?.userId) {
        await auditService.log({
          action: 'USER_LOGOUT',
          resource: 'auth',
          userId: decoded.userId,
          details: {},
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        });
      }
    }
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/validate', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const authService = serviceRegistry.get('AuthService');
    const result = await authService.validateToken(token);
    
    res.json({ valid: true, user: result.user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const authService = serviceRegistry.get('AuthService');
    const newToken = await authService.refreshToken(token);
    
    res.json({ message: 'Token refreshed', token: newToken });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

export default router;