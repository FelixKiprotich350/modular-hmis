import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuditService } from '../../modules/core/audit/services/audit.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private auditService: AuditService;

  constructor(private prisma: PrismaService, private reflector: Reflector) {
    this.auditService = new AuditService(prisma);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const handler = context.getHandler();
    
    const { method, url, user, ip, headers, body, params, query } = request;
    const userAgent = headers['user-agent'];
    const auditMetadata = this.reflector.get<string>('audit', handler);
    const startTime = Date.now();

    return next.handle().pipe(
      tap(async (data) => {
        const duration = Date.now() - startTime;
        
        // Audit all operations except simple GET requests without sensitive data
        const shouldAudit = this.shouldAuditOperation(method, url, auditMetadata, response.statusCode);
        
        if (shouldAudit) {
          await this.auditService.log({
            userId: user?.userId,
            action: this.getActionDescription(method, url, auditMetadata),
            resource: this.extractResource(url),
            resourceId: this.extractResourceId(url, data, params),
            details: {
              method,
              url,
              body: this.sanitizeBody(body),
              params: this.sanitizeParams(params),
              query: this.sanitizeQuery(query),
              statusCode: response.statusCode,
              duration,
              success: true
            },
            ipAddress: this.getClientIp(request),
            userAgent
          });
        }
      }),
      catchError(async (error) => {
        const duration = Date.now() - startTime;
        
        // Always audit failed operations
        await this.auditService.log({
          userId: user?.userId,
          action: `FAILED: ${this.getActionDescription(method, url, auditMetadata)}`,
          resource: this.extractResource(url),
          resourceId: this.extractResourceId(url, null, params),
          details: {
            method,
            url,
            body: this.sanitizeBody(body),
            params: this.sanitizeParams(params),
            error: error.message,
            statusCode: error.status || 500,
            duration,
            success: false
          },
          ipAddress: this.getClientIp(request),
          userAgent
        });
        
        return throwError(() => error);
      })
    );
  }

  private shouldAuditOperation(method: string, url: string, auditMetadata: any, statusCode: number): boolean {
    // Always audit if explicitly marked for audit
    if (auditMetadata) return true;
    
    // Always audit write operations
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return true;
    
    // Audit sensitive GET operations
    if (method === 'GET' && this.isSensitiveEndpoint(url)) return true;
    
    // Audit failed operations
    if (statusCode >= 400) return true;
    
    return false;
  }

  private isSensitiveEndpoint(url: string): boolean {
    const sensitivePatterns = [
      '/api/users',
      '/api/roles',
      '/api/audit',
      '/api/settings',
      '/api/patients',
      '/api/encounters',
      '/api/observations'
    ];
    
    return sensitivePatterns.some(pattern => url.includes(pattern));
  }

  private getActionDescription(method: string, url: string, auditMetadata?: string): string {
    if (auditMetadata && typeof auditMetadata === 'string') {
      return auditMetadata;
    }
    
    const resource = this.extractResource(url);
    const actionMap = {
      'GET': `View ${resource}`,
      'POST': `Create ${resource}`,
      'PUT': `Update ${resource}`,
      'PATCH': `Modify ${resource}`,
      'DELETE': `Delete ${resource}`
    };
    
    return actionMap[method] || `${method} ${url}`;
  }

  private extractResource(url: string): string {
    const parts = url.split('/').filter(Boolean);
    if (parts.length >= 2 && parts[0] === 'api') {
      return parts[1];
    }
    return parts[0] || 'unknown';
  }

  private extractResourceId(url: string, responseData: any, params: any): string | undefined {
    // Extract ID from URL parameters
    if (params?.id) return params.id;
    
    // Extract ID from URL path
    const pathMatch = url.match(/\/([a-zA-Z0-9_-]+)$/);
    if (pathMatch && pathMatch[1] !== url.split('/').filter(Boolean).pop()) {
      return pathMatch[1];
    }
    
    // Extract ID from response data
    if (responseData?.data?.id) return responseData.data.id;
    if (responseData?.user?.id) return responseData.user.id;
    if (responseData?.role?.id) return responseData.role.id;
    if (responseData?.id) return responseData.id;
    
    return undefined;
  }

  private sanitizeBody(body: any): any {
    if (!body) return undefined;
    
    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }

  private sanitizeParams(params: any): any {
    if (!params) return undefined;
    return { ...params };
  }

  private sanitizeQuery(query: any): any {
    if (!query) return undefined;
    
    const sanitized = { ...query };
    const sensitiveFields = ['password', 'token', 'secret'];
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }

  private getClientIp(request: any): string {
    return request.ip || 
           request.connection?.remoteAddress || 
           request.socket?.remoteAddress ||
           request.headers['x-forwarded-for']?.split(',')[0] ||
           'unknown';
  }
}