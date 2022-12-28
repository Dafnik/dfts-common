import {HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {loggerOf} from '@dfts-common/dfts-helper';

import {HELPER_CONFIG, HelperConfig} from '../config';
import {AbstractIgnoreableInterceptor} from './abstract-ignoreable';
import {BASE_URL_INTERCEPTOR} from './http-context-token';

@Injectable()
export class BaseUrlInterceptor extends AbstractIgnoreableInterceptor {
  private lumber = loggerOf('httpClient');
  baseUrl?: string;

  constructor(@Inject(HELPER_CONFIG) config: HelperConfig) {
    super(BASE_URL_INTERCEPTOR, config.baseUrlInterceptorIgnorePaths);
    this.baseUrl = config.baseUrl;
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.baseUrl && this.baseUrl.length > 0 && this.shouldIntercept(req)) {
      return next.handle(req.clone({url: `${this.baseUrl + req.url}`}));
    }

    this.lumber.warning(
      'intercept',
      'baseUrl undefined! It looks like you are using the BaseUrlInterceptor but forgot assigning a base url.'
    );
    return next.handle(req);
  }
}
