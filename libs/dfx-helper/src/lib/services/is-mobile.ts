import {inject, Injectable, NgZone, Provider} from '@angular/core';
import {ViewportRuler} from '@angular/cdk/overlay';
import {distinctUntilChanged, map, shareReplay} from 'rxjs';
import {HELPER_MOBILE_BREAKPOINT} from '../config';

@Injectable()
export class IsMobileService {
  private readonly isMobileBreakpoint = inject(HELPER_MOBILE_BREAKPOINT);
  private readonly ngZone = inject(NgZone);
  private readonly viewportRuler = inject(ViewportRuler);

  public isMobile$ = this.viewportRuler.change(200).pipe(
    map(() => this.viewportRuler.getViewportSize().width <= this.isMobileBreakpoint),
    distinctUntilChanged(),
    shareReplay(1)
  );
}

export function injectIsMobile$() {
  return inject(IsMobileService).isMobile$;
}

export function provideIsMobileService(): Provider {
  return {provide: IsMobileService};
}
