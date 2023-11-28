import {
  HttpContextToken,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { Observable, of, share, tap } from "rxjs";

export const ICON_CACHE_INTERCEPTOR = new HttpContextToken(() => false);

const DEBUG = false;

const cache: Map<string, Observable<HttpEvent<unknown>>> = new Map();

export function biCacheInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if (DEBUG) console.warn('cache interceptor run')
  if (req.method !== "GET" || !req.context.get(ICON_CACHE_INTERCEPTOR)) {
    return next(req);
  }
  const url = req.url;
  const cachedResponse = cache.get(url);
  if (DEBUG) console.log(`reading cache of ${url}`, cachedResponse)
  if (cachedResponse) {
    return cachedResponse;
  } else {
    if (DEBUG) console.log(`trying new request ${url}`)
    const newRequest = next(req).pipe(
      tap(stateEvent => {
        if (stateEvent instanceof HttpResponse) {
          if (DEBUG) console.log(`setting response to cache ${url}`)
          cache.set(url, of(stateEvent.clone()).pipe(share()));
        }
      }),
      share()
    );
    if (DEBUG) console.log(`setting new request ${url} to cache`)
    cache.set(url, newRequest);

    return newRequest;
  }
}
