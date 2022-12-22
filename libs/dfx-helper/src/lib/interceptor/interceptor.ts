import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {inject} from '@angular/core';
import {BASE_URL_INTERCEPTOR, LOGGING_INTERCEPTOR, POST_PUT_JSON_CONTENT_TYPE_INTERCEPTOR} from './http-context-token';
import {getLogHeader} from 'dfts';
import {HELPER_CONFIG, HelperConfig} from '../config';

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
  const config = inject(HELPER_CONFIG) as HelperConfig;

  if (config.baseUrl && config.baseUrl.length > 0 && shouldIntercept(req, BASE_URL_INTERCEPTOR, config.baseUrlInterceptorIgnorePaths)) {
    return next(req.clone({url: `${config.baseUrl + req.url}`}));
  }

  console.log(
    getLogHeader(
      'ERROR',
      'httpClient',
      'baseUrlInterceptor',
      'baseUrl undefined! It looks like you are using baseUrlInterceptor() but forgot assigning a base url.'
    )
  );
  return next(req);
}

export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const config = inject(HELPER_CONFIG) as HelperConfig;

  if (!shouldIntercept(req, LOGGING_INTERCEPTOR, config.loggingInterceptorIgnorePaths)) {
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
          console.group(getLogHeader('LOG', 'httpClient', req.method, text));
          if (req.body !== undefined && req.body != null) {
            console.log(getLogHeader('LOG', 'httpClient', req.method, 'Request body'), req.body);
          }
          if (event) {
            console.log(getLogHeader('LOG', 'httpClient', req.method, 'Request response'), event);
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
      console.log(getLogHeader('ERROR', 'httpClient', req.method, text), error);

      return throwError(() => error);
    })
  );
}

export function postPutJsonContentTypeInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const config = inject(HELPER_CONFIG) as HelperConfig;

  if (!shouldIntercept(req, POST_PUT_JSON_CONTENT_TYPE_INTERCEPTOR, config.postPutJsonContentTypeInterceptorIgnorePaths)) {
    return next(req);
  }

  const method = req.method.toLowerCase();
  if (method.includes('post') || method.includes('put')) {
    return next(req.clone({headers: req.headers.set('Content-Type', 'application/json')}));
  }
  return next(req);
}
