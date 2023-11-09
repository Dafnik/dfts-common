import { ChangeDetectorRef, inject } from '@angular/core';
import { Subscription } from 'rxjs';

export class AsyncTranslatePipe {
  translation?: string;
  translationSubscription?: Subscription;

  ref = inject(ChangeDetectorRef);

  unsubscribe(): void {
    this.translation = undefined;
    if (this.translationSubscription) {
      this.translationSubscription.unsubscribe();
    }
  }
}
