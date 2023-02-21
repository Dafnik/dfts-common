import {inject, Injectable, NgZone, OnDestroy} from '@angular/core';
import {ViewportRuler} from '@angular/cdk/overlay';
import {BehaviorSubject, distinctUntilChanged, shareReplay} from 'rxjs';
import {HELPER_MOBILE_BREAKPOINT} from '../config';

@Injectable({
  providedIn: 'root',
})
export class IsMobileService implements OnDestroy {
  private readonly isMobileBreakpoint = inject(HELPER_MOBILE_BREAKPOINT);

  private getIsMobile = this.viewportRuler.getViewportSize().width <= this.isMobileBreakpoint;

  private _isMobile = this.getIsMobile;
  private isMobileChange = new BehaviorSubject(this._isMobile);

  private viewportChange = this.viewportRuler.change(200).subscribe(() => this.ngZone.run(() => this.set()));

  constructor(private ngZone: NgZone, private viewportRuler: ViewportRuler) {}

  public isMobile$ = this.isMobileChange.pipe(distinctUntilChanged(), shareReplay(1));

  public isMobile = this._isMobile;

  private set(): void {
    this._isMobile = this.getIsMobile;
    this.isMobileChange.next(this._isMobile);
  }

  ngOnDestroy(): void {
    this.viewportChange.unsubscribe();
  }
}
