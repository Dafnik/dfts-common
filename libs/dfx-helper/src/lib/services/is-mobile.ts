import { inject, Injectable, Provider, Signal } from '@angular/core';
import { ViewportRuler } from '@angular/cdk/overlay';
import { distinctUntilChanged, map, Observable, shareReplay, startWith } from 'rxjs';
import { HELPER_MOBILE_BREAKPOINT } from '../config';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable()
export class IsMobileService {
  private readonly isMobileBreakpoint = inject(HELPER_MOBILE_BREAKPOINT);
  private readonly viewportRuler = inject(ViewportRuler);

  private checkIsMobile = () => this.viewportRuler.getViewportSize().width <= this.isMobileBreakpoint;

  public isMobile = toSignal(this.viewportRuler.change(50).pipe(map(this.checkIsMobile), distinctUntilChanged()), {
    initialValue: this.checkIsMobile(),
  });

  public isMobile$ = this.viewportRuler
    .change(50)
    .pipe(map(this.checkIsMobile), startWith(this.checkIsMobile()), distinctUntilChanged(), shareReplay(1));
}

export function injectIsMobile$(): Observable<boolean> {
  return inject(IsMobileService).isMobile$;
}

export function injectIsMobile(): Signal<boolean> {
  return inject(IsMobileService).isMobile;
}

export function provideIsMobileService(): Provider {
  return { provide: IsMobileService };
}
