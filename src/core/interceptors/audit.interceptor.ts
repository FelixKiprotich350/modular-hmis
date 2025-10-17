import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../../modules/core/audit/services/audit.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private auditService: AuditService;

  constructor(private prisma: PrismaService) {
    this.auditService = new AuditService(prisma);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    const { method, url, user, ip, headers } = request;
    const userAgent = headers['user-agent'];

    return next.handle().pipe(
      tap(async (data) => {
        // Only audit non-GET requests and successful responses
        if (method !== 'GET' && response.statusCode < 400) {
          await this.auditService.log({
            userId: user?.userId,
            action: `${method} ${url}`,
            resource: this.extractResource(url),
            resourceId: this.extractResourceId(url, data),
            details: {
              method,
              url,
              body: this.sanitizeBody(request.body),
              statusCode: response.statusCode
            },
            ipAddress: ip,
            userAgent
          });
        }
      })
    );
  }

  private extractResource(url: string): string {
    const parts = url.split('/').filter(Boolean);
    return parts[1] || 'unknown'; // api/users -> users
  }

  private extractResourceId(url: string, responseData: any): string | undefined {
    // Extract ID from URL path
    const pathMatch = url.match(/\/([a-zA-Z0-9_-]+)$/);
    if (pathMatch) return pathMatch[1];
    
    // Extract ID from response data
    if (responseData?.user?.id) return responseData.user.id;
    if (responseData?.role?.id) return responseData.role.id;
    if (responseData?.id) return responseData.id;
    
    return undefined;
  }

  private sanitizeBody(body: any): any {
    if (!body) return undefined;
    
    const sanitized = { ...body };
    // Remove sensitive fields
    delete sanitized.password;
    delete sanitized.token;
    
    return sanitized;
  }
}