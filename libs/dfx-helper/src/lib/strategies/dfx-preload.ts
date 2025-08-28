import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';

import { Observable, mergeMap, of, timer } from 'rxjs';

@Injectable()
export class DfxPreloadStrategy implements PreloadingStrategy {
  preload(route: Route, loadMe: () => Observable<unknown>): Observable<unknown> {
    if (route.data && route.data['preload']) {
      const delay = (route.data['delay'] as number | undefined) ?? 0;
      return timer(delay).pipe(mergeMap(() => loadMe()));
    } else {
      return of(null);
    }
  }
}
