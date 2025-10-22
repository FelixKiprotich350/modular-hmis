import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query } = request;
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        this.logger.log(`${method} ${url} - ${duration}ms`);
        
        if (Object.keys(query).length > 0) {
          this.logger.debug(`Query: ${JSON.stringify(query)}`);
        }
        
        if (body && Object.keys(body).length > 0) {
          this.logger.debug(`Body: ${JSON.stringify(body)}`);
        }
      })
    );
  }
}