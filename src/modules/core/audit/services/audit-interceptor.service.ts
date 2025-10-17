import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditInterceptorService implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, headers, body } = request;
    
    const auditData = {
      userId: headers['user-id'] || 'anonymous',
      action: method,
      resource: url,
      details: { body },
      ipAddress: request.ip,
      userAgent: headers['user-agent']
    };

    return next.handle().pipe(
      tap(() => {
        // Log successful operations
        console.log('AUDIT:', auditData);
      })
    );
  }
}