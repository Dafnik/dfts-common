import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { BiComponent, provideBi, withCDN, withIcons } from 'dfx-bootstrap-icons';
import { isPlatformBrowser } from '@angular/common';

@Component({
  template: `
    <div class="d-flex align-items-center justify-content-end gap-2 my-2" (click)="showIcon.set(!showIcon())">
      <span>This icon gets loaded via cdn </span>
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
