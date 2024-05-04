import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class EntityResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Extract _doc property if present
        const mainData = data?._doc || data;
        // Convert response objects to snake case
        return this.transformKeysToSnakeCase(mainData);
      }),
    );
  }

  private transformKeysToSnakeCase(obj: any): any {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }
    let snakeCaseKeys = Object.keys(obj).map((key) => {
      return key.replace(/([A-Z])/g, '_$1').toLowerCase();
    });

    const buffer = Object.keys(obj).map((key, index) => {
      return { [snakeCaseKeys[index]]: obj[key] };
    });
    const snakeCaseObj = Object.assign({}, ...buffer);
    return snakeCaseObj;
  }
}
