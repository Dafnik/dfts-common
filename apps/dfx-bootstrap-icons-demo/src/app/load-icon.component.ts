import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BiComponent, provideBi, withCDN, withIcons } from 'dfx-bootstrap-icons';

@Component({
  template: `
    <div class="d-flex align-items-center justify-content-end gap-2 my-2" (click)="showIcon.set(!showIcon())">
      <span>This icon gets loaded via cdn </span>
      @if (showIcon()) {
      <bi name="box" size="16" />
      }
    </div>
  `,
  standalone: true,
  imports: [BiComponent],
  providers: [provideBi(withIcons({}), withCDN('https://playground.dafnik.me/bootstrap-icons/icons'))],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-load-icon',
})
export class LoadIconComponent {
  showIcon = signal(true);
}
