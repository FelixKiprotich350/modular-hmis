import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const requestId = uuidv4().substring(0, 10);
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map(data => {
        const durationMs = Date.now() - startTime;
        
        // If response is already in ApiResponse format, return as is
        if (data && typeof data === 'object' && 'success' in data && 'timestamp' in data) {
          return data;
        }

        // Build meta object
        const meta: any = {
          requestId: `req_${requestId}`,
          durationMs
        };

        // Add pagination meta if present
        if (data && typeof data === 'object') {
          if ('total' in data) meta.total = data.total;
          if ('page' in data) meta.page = data.page;
          if ('limit' in data) meta.limit = data.limit;
          if ('totalPages' in data) meta.totalPages = data.totalPages;
        }

        return {
          success: true,
          message: this.getSuccessMessage(context),
          status: response.statusCode,
          timestamp: new Date().toISOString(),
          data: data,
          meta
        };
      })
    );
  }

  private getSuccessMessage(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const path = request.route?.path || request.url;

    if (method === 'POST') return 'Resource created successfully';
    if (method === 'PUT' || method === 'PATCH') return 'Resource updated successfully';
    if (method === 'DELETE') return 'Resource deleted successfully';
    return 'Request completed successfully';
  }
}