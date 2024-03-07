import {ChangeDetectorRef, DestroyRef, inject} from '@angular/core';

export class AsyncTranslatePipe {
  translation?: string;

  ref = inject(ChangeDetectorRef);
  destroyRef = inject(DestroyRef);
}
