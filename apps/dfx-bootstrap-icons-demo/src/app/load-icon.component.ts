import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject, signal } from '@angular/core';

import { BiComponent, provideBi, withCDN } from 'dfx-bootstrap-icons';

@Component({
  template: `
    <div class="d-flex align-items-center justify-content-end my-2 gap-2" (click)="showIcon.set(!showIcon())">
      <span>This icon gets loaded via cdn</span>
      @if (showIcon()) {
        <bi name="box" size="16" />
      }
    </div>
  `,
  imports: [BiComponent],
  providers: [
    provideBi(
      withCDN(() => {
        const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

        console.log('injection test', isBrowser);

        return 'https://playground.dafnik.me/bootstrap-icons/icons';
      }),
    ),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-load-icon',
})
export class LoadIconComponent {
  showIcon = signal(true);
}
