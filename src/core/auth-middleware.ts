import { Request, Response, NextFunction } from 'express';
import { serviceRegistry } from './service-registry';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const authService = serviceRegistry.get('AuthService');
    if (!authService) {
      return res.status(500).json({ error: 'Auth service not available' });
    }

    const result = await authService.validateToken(token);
    req.user = result.user;
    
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const requirePrivileges = (requiredPrivileges: string[], requireAll: boolean = true) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const privilegeService = serviceRegistry.get('PrivilegeService');
      if (!privilegeService) {
        return res.status(500).json({ error: 'Privilege service not available' });
      }

      let hasAccess: boolean;
      if (requireAll) {
        hasAccess = await privilegeService.hasAllPrivileges(req.user.id, requiredPrivileges);
      } else {
        hasAccess = await privilegeService.hasAnyPrivilege(req.user.id, requiredPrivileges);
      }
      
      if (!hasAccess) {
        // Log unauthorized access attempt
        const auditService = serviceRegistry.get('AuditService');
        if (auditService) {
          await auditService.log({
            action: 'UNAUTHORIZED_ACCESS',
            resource: req.path,
            userId: req.user.id,
            details: { requiredPrivileges, method: req.method, requireAll },
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
          });
        }
        
        return res.status(403).json({ 
          error: 'Insufficient privileges',
          required: requiredPrivileges,
          requireAll
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: 'Authorization check failed' });
    }
  };
};

export const requireRole = (requiredRoles: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const privilegeService = serviceRegistry.get('PrivilegeService');
      if (!privilegeService) {
        return res.status(500).json({ error: 'Privilege service not available' });
      }

      const userRoles = await privilegeService.getUserRoles(req.user.id);
      const hasRole = requiredRoles.some(role => userRoles.includes(role));
      
      if (!hasRole) {
        // Log unauthorized access attempt
        const auditService = serviceRegistry.get('AuditService');
        if (auditService) {
          await auditService.log({
            action: 'UNAUTHORIZED_ROLE_ACCESS',
            resource: req.path,
            userId: req.user.id,
            details: { requiredRoles, userRoles, method: req.method },
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
          });
        }
        
        return res.status(403).json({ 
          error: 'Insufficient role access',
          required: requiredRoles
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: 'Role check failed' });
    }
  };
};