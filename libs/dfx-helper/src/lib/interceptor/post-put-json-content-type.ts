import {Inject, Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

import {HELPER_CONFIG, HelperConfig} from '../config';
import {AbstractIgnoreableInterceptor} from './abstract-ignoreable';
import {POST_PUT_JSON_CONTENT_TYPE_INTERCEPTOR} from './http-context-token';

@Injectable()
export class PostPutJsonContentTypeInterceptor extends AbstractIgnoreableInterceptor {
  constructor(@Inject(HELPER_CONFIG) config: HelperConfig) {
    super(POST_PUT_JSON_CONTENT_TYPE_INTERCEPTOR, config.postPutJsonContentTypeInterceptorIgnorePaths);
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.shouldIntercept(req)) {
      return next.handle(req);
    }

    const method = req.method.toLowerCase();
    if (method.includes('post') || method.includes('put')) {
      return next.handle(req.clone({headers: req.headers.set('Content-Type', 'application/json')}));
    }
    return next.handle(req);
  }
}
