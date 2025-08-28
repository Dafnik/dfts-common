import { HttpContextToken, HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';

import { Observable, shareReplay, tap } from 'rxjs';

export const ICON_CACHE_INTERCEPTOR = new HttpContextToken(() => false);

const DEBUG = false;

// Cache stores shared observables
const cache: Map<string, Observable<HttpEvent<unknown>>> = new Map();

export function biCacheInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if (DEBUG) console.warn('cache interceptor run');

  if (req.method !== 'GET' || !req.context.get(ICON_CACHE_INTERCEPTOR)) {
    return next(req);
  }

  const url = req.url;
  const cachedResponse = cache.get(url);

  if (DEBUG) console.log(`reading cache of ${url}`, cachedResponse);

  if (cachedResponse) {
    return cachedResponse;
  }

  if (DEBUG) console.log(`creating new request for ${url}`);

  // Create a shared observable that replays the last value
  const sharedRequest = next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse && DEBUG) {
        console.log(`caching response for ${url}`);
      }
    }),
    shareReplay(1), // ensures all subscribers share the same request + replay
  );

  cache.set(url, sharedRequest);

  return sharedRequest;
}
