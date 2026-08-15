import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const response = context.switchToHttp().getResponse<Response>();

        return next.handle().pipe(
            map((data) => {
                if (Buffer.isBuffer(data) || (data && typeof data.pipe === 'function')) {
                    return data;
                }

                return {
                    success: true,
                    statusCode: response.statusCode,
                    timestamp: new Date().toISOString(),
                    data,
                };
            }),
        );
    }
}
