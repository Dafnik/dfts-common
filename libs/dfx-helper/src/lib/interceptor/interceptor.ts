import { HttpContextToken, HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable, catchError, tap, throwError } from 'rxjs';

import { getLogMessage } from 'dfts-helper';

import {
  HELPER_BASE_URL,
  HELPER_BASE_URL_INTERCEPTOR_IGNORE_PATHS,
  HELPER_LOGGING_INTERCEPTOR_IGNORE_PATHS,
  HELPER_POST_PUT_JSON_CONTENT_TYPE_INTERCEPTOR_IGNORE_PATHS,
} from '../config';
import { BASE_URL_INTERCEPTOR, LOGGING_INTERCEPTOR, POST_PUT_JSON_CONTENT_TYPE_INTERCEPTOR } from './http-context-token';

export function shouldIntercept(req: HttpRequest<unknown>, BY_PASS?: HttpContextToken<boolean>, ignorePaths?: string[]): boolean {
  if (BY_PASS && req.context.get(BY_PASS)) {
    return false;
  }
  if (!ignorePaths) {
    return true;
  }
  // Fastest method
  for (const path of ignorePaths) {
    if (req.url.includes(path)) {
      return false;
    }
  }
  return true;
}

export function baseUrlInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const baseUrl = inject(HELPER_BASE_URL);

  if (baseUrl.length > 0 && shouldIntercept(req, BASE_URL_INTERCEPTOR, inject(HELPER_BASE_URL_INTERCEPTOR_IGNORE_PATHS))) {
    return next(req.clone({ url: `${baseUrl + req.url}` }));
  }

  if (baseUrl.length < 1) {
    console.log(
      getLogMessage(
        'ERROR',
        'httpClient',
        'baseUrlInterceptor',
        'baseUrl undefined! It looks like you are using baseUrlInterceptor() but forgot assigning a base url.',
      ),
    );
  }

  return next(req);
}

export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if (!shouldIntercept(req, LOGGING_INTERCEPTOR, inject(HELPER_LOGGING_INTERCEPTOR_IGNORE_PATHS))) {
    return next(req);
  }

  let text = `URL: "${req.url}" ${req.params.keys().length > 0 ? ` | params: "${req.params.toString()}"` : ''}`;

  const startTime = Date.now();
  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          const elapsedTime = Date.now() - startTime;
          text = `Status: Success | ${text} | Elapsed time: ${elapsedTime}ms`;
          console.group(getLogMessage('LOG', 'httpClient', req.method, text));
          if (req.body !== undefined && req.body != null) {
            console.log(getLogMessage('LOG', 'httpClient', req.method, 'Request body'), req.body);
          }
          if (event) {
            console.log(getLogMessage('LOG', 'httpClient', req.method, 'Request response'), event);
          }
          console.groupEnd();
        }
      },
    }),
    catchError((error: unknown) => {
      if (error instanceof ErrorEvent) {
        text += ` | Error: ${error.message}`;
      } else if (error instanceof HttpErrorResponse) {
        text += ` | Error Status: ${error.status} | ${error.message}`;
      }
      const elapsedTime = Date.now() - startTime;
      text = `Status: Error   | ${text} | Elapsed time: ${elapsedTime}ms`;
      console.log(getLogMessage('ERROR', 'httpClient', req.method, text), error);

      return throwError(() => error);
    }),
  );
}

export function postPutJsonContentTypeInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if (!shouldIntercept(req, POST_PUT_JSON_CONTENT_TYPE_INTERCEPTOR, inject(HELPER_POST_PUT_JSON_CONTENT_TYPE_INTERCEPTOR_IGNORE_PATHS))) {
    return next(req);
  }

  const method = req.method.toLowerCase();
  if (method.includes('post') || method.includes('put')) {
    return next(req.clone({ headers: req.headers.set('Content-Type', 'application/json') }));
  }
  return next(req);
}
