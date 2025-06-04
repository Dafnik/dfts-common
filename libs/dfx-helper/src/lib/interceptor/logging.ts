import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable, catchError, tap, throwError } from 'rxjs';

import { loggerOf } from 'dfts-helper';

import { HELPER_LOGGING_INTERCEPTOR_IGNORE_PATHS } from '../config';
import { AbstractIgnorableInterceptor } from './abstract-ignoreable';
import { LOGGING_INTERCEPTOR } from './http-context-token';

@Injectable()
export class LoggingInterceptor extends AbstractIgnorableInterceptor {
  private lumber = loggerOf('httpClient');

  constructor() {
    super(LOGGING_INTERCEPTOR, inject(HELPER_LOGGING_INTERCEPTOR_IGNORE_PATHS));
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.shouldIntercept(req)) {
      return next.handle(req);
    }

    let text = `URL: "${req.url}" ${req.params.keys().length > 0 ? ` | params: "${req.params.toString()}"` : ''}`;

    const startTime = Date.now();
    return next.handle(req).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            const elapsedTime = Date.now() - startTime;
            text = `Status: Success | ${text} | Elapsed time: ${elapsedTime}ms`;
            this.lumber.group(req.method, text);
            if (req.body !== undefined && req.body !== null) {
              this.lumber.log(req.method, 'Request body', req.body);
            }
            if (event) {
              this.lumber.log(req.method, 'Request response', event);
            }
            this.lumber.groupEnd();
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
        this.lumber.error(req.method, text, error);

        return throwError(() => error);
      }),
    );
  }
}
