import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { loggerOf } from 'dfts-helper';

import { HELPER_BASE_URL, HELPER_BASE_URL_INTERCEPTOR_IGNORE_PATHS } from '../config';
import { AbstractIgnorableInterceptor } from './abstract-ignoreable';
import { BASE_URL_INTERCEPTOR } from './http-context-token';

@Injectable()
export class BaseUrlInterceptor extends AbstractIgnorableInterceptor {
  private lumber = loggerOf('httpClient');
  baseUrl = inject(HELPER_BASE_URL);

  constructor() {
    super(BASE_URL_INTERCEPTOR, inject(HELPER_BASE_URL_INTERCEPTOR_IGNORE_PATHS));
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.baseUrl.length > 0 && this.shouldIntercept(req)) {
      return next.handle(req.clone({ url: `${this.baseUrl + req.url}` }));
    }

    if (this.baseUrl.length < 1) {
      this.lumber.warning(
        'intercept',
        'baseUrl undefined! It looks like you are using the BaseUrlInterceptor but forgot assigning a base url.',
      );
    }

    return next.handle(req);
  }
}
