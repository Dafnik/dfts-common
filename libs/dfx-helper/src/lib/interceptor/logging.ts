import {Inject, Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {loggerOf} from 'dfts';

import {AbstractIgnoreableInterceptor} from './abstract-ignoreable';
import {HELPER_CONFIG, HelperConfig} from '../config';
import {LOGGING_INTERCEPTOR} from './http-context-token';

@Injectable()
export class LoggingInterceptor extends AbstractIgnoreableInterceptor {
  private lumber = loggerOf('httpClient');

  constructor(@Inject(HELPER_CONFIG) config: HelperConfig) {
    super(LOGGING_INTERCEPTOR, config.loggingInterceptorIgnorePaths);
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
      })
    );
  }
}
