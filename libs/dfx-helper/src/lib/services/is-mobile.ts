import {Inject, Injectable, NgZone, OnDestroy} from '@angular/core';
import {ViewportRuler} from '@angular/cdk/overlay';
import {BehaviorSubject, distinctUntilChanged, Observable, share} from 'rxjs';
import {HELPER_CONFIG, HelperConfig} from '../config';

@Injectable({
  providedIn: 'root',
})
export class IsMobileService implements OnDestroy {
  private readonly isMobileBreakpoint: number = 992;

  private getIsMobile = this.viewportRuler.getViewportSize().width <= this.isMobileBreakpoint;

  private _isMobile = this.getIsMobile;
  readonly isMobileChange = new BehaviorSubject(this._isMobile);

  private readonly viewportChange = this.viewportRuler.change(200).subscribe(() => this.ngZone.run(() => this.set()));

  constructor(@Inject(HELPER_CONFIG) config: HelperConfig, private ngZone: NgZone, private viewportRuler: ViewportRuler) {
    this.isMobileBreakpoint = config.isMobileBreakpoint ?? this.isMobileBreakpoint;
  }

  isMobile$: Observable<boolean> = this.isMobileChange.pipe(distinctUntilChanged(), share());

  isMobile = this._isMobile;

  private set(): void {
    this._isMobile = this.getIsMobile;
    this.isMobileChange.next(this._isMobile);
  }

  ngOnDestroy(): void {
    this.viewportChange.unsubscribe();
  }
}
