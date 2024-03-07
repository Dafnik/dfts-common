import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, NgModule, numberAttribute } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, distinctUntilChanged, map, of, switchMap, timer } from 'rxjs';
import { interceptorByPass } from '../interceptor/by-pass-interceptor.builder';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: '[hideIfPingSucceeds]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DfxHideIfPingSucceeds {
  @Input() url!: string;

  /**
   * Refresh time in seconds
   */
  @Input({ transform: numberAttribute }) refreshTime = 10;

  @HostBinding('hidden')
  get hidden(): boolean {
    return !this.isOffline;
  }

  private byPassLoggingInterceptor = interceptorByPass().logging().buildAsOptions();
  private isOffline = false;

  constructor(httpClient: HttpClient, changeDetectorRef: ChangeDetectorRef) {
    timer(0, this.refreshTime * 1000)
      .pipe(
        takeUntilDestroyed(),
        switchMap(() =>
          httpClient.get(this.url, this.byPassLoggingInterceptor).pipe(
            map(() => false),
            catchError(() => of(true)),
          ),
        ),
        distinctUntilChanged(),
      )
      .subscribe((isOffline) => {
        this.isOffline = isOffline;
        changeDetectorRef.markForCheck();
      });
  }
}

@Component({
  selector: '[hideIfPingFails]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DfxHideIfPingFails extends DfxHideIfPingSucceeds {
  @HostBinding('hidden')
  override get hidden(): boolean {
    return !super.hidden;
  }
}

@NgModule({
  imports: [DfxHideIfPingSucceeds, DfxHideIfPingFails],
  exports: [DfxHideIfPingSucceeds, DfxHideIfPingFails],
})
export class DfxHideIfPingModule {}
