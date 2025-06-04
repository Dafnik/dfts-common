import { HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { shouldIntercept } from './interceptor';

export abstract class AbstractIgnorableInterceptor implements HttpInterceptor {
  protected constructor(
    protected BY_PASS?: HttpContextToken<boolean>,
    protected ignorePaths?: string[],
  ) {}

  abstract intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>;

  shouldIntercept = (req: HttpRequest<unknown>): boolean => shouldIntercept(req, this.BY_PASS, this.ignorePaths);
}
