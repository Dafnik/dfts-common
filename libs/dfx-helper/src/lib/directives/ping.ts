import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding, inject,
  input,
  NgModule,
  numberAttribute
} from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { catchError, combineLatest, distinctUntilChanged, map, of, switchMap, timer } from "rxjs";
import { interceptorByPass } from "../interceptor";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";

@Component({
  selector: "[hideIfPingSucceeds]",
  standalone: true,
  template: "<ng-content></ng-content>",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DfxHideIfPingSucceeds {
  #httpClient = inject(HttpClient)
  #changeDetectorRef = inject(ChangeDetectorRef);

  url = input.required<string>()
  #url$ = toObservable(this.url);

  /**
   * Refresh time in seconds
   */
  refreshTime = input(10, { transform: numberAttribute });
  #refreshTime$ = toObservable(this.refreshTime);

  @HostBinding("hidden")
  get hidden(): boolean {
    return !this.isOffline;
  }

  private byPassLoggingInterceptor = interceptorByPass().logging().buildAsOptions();
  private isOffline = false;

  constructor() {
    combineLatest([this.#refreshTime$, this.#url$]).pipe(
      takeUntilDestroyed(),
      switchMap(([refreshTime, url]) => combineLatest([
        of(url),
        timer(0, refreshTime * 1000)
      ])),
      switchMap(([url]) => this.#httpClient.get(url, this.byPassLoggingInterceptor).pipe(
          map(() => false),
          catchError(() => of(true))
        )
      ),
      distinctUntilChanged()
    ).subscribe((isOffline) => {
      this.isOffline = isOffline;
      this.#changeDetectorRef.markForCheck();
    });
  }
}

@Component({
  selector: "[hideIfPingFails]",
  standalone: true,
  template: "<ng-content></ng-content>",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DfxHideIfPingFails extends DfxHideIfPingSucceeds {
  @HostBinding("hidden")
  override get hidden(): boolean {
    return !super.hidden;
  }
}

@NgModule({
  imports: [DfxHideIfPingSucceeds, DfxHideIfPingFails],
  exports: [DfxHideIfPingSucceeds, DfxHideIfPingFails]
})
export class DfxHideIfPingModule {
}
