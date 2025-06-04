import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { HELPER_POST_PUT_JSON_CONTENT_TYPE_INTERCEPTOR_IGNORE_PATHS } from '../config';
import { AbstractIgnorableInterceptor } from './abstract-ignoreable';
import { POST_PUT_JSON_CONTENT_TYPE_INTERCEPTOR } from './http-context-token';

@Injectable()
export class PostPutJsonContentTypeInterceptor extends AbstractIgnorableInterceptor {
  constructor() {
    super(POST_PUT_JSON_CONTENT_TYPE_INTERCEPTOR, inject(HELPER_POST_PUT_JSON_CONTENT_TYPE_INTERCEPTOR_IGNORE_PATHS));
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.shouldIntercept(req)) {
      return next.handle(req);
    }

    const method = req.method.toLowerCase();
    if (method.includes('post') || method.includes('put')) {
      return next.handle(req.clone({ headers: req.headers.set('Content-Type', 'application/json') }));
    }
    return next.handle(req);
  }
}
