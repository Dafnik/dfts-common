import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, NgModule} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {coerceNumberProperty, NumberInput} from '@angular/cdk/coercion';
import {catchError, distinctUntilChanged, map, of, switchMap, timer} from 'rxjs';
import {interceptorByPass} from '../interceptor/by-pass-interceptor.builder';
import {AComponent} from '../components/abstract-component';

@Component({
  selector: '[hideIfPingSucceeds]',
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DfxHideIfPingSucceeds extends AComponent {
  @Input() url!: string;

  /**
   * Refresh time in seconds
   */
  @Input() set refreshTime(value: NumberInput) {
    this._refreshTime = coerceNumberProperty(value);
  }

  protected _refreshTime = 10;

  @HostBinding('hidden')
  get hidden(): boolean {
    return !this.isOffline;
  }

  private byPassLoggingInterceptor = interceptorByPass().logging().buildAsOptions();
  private isOffline = false;

  constructor(httpClient: HttpClient, changeDetectorRef: ChangeDetectorRef) {
    super();
    this.unsubscribe(
      timer(0, this._refreshTime * 1000)
        .pipe(
          switchMap(() => httpClient.get(this.url, this.byPassLoggingInterceptor)),
          map(() => true),
          catchError(() => of(false)),
          distinctUntilChanged()
        )
        .subscribe((isOffline) => {
          this.isOffline = isOffline;
          changeDetectorRef.markForCheck();
        })
    );
  }
}

@Component({
  selector: '[hideIfPingFails]',
  standalone: true,
  template: '',
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
