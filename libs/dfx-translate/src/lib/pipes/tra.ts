import { Pipe, PipeTransform } from '@angular/core';
import { AsyncTranslatePipe } from './async.pipe';
import { dfxAutoTranslate$ } from '../service/rx-auto-translate';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Pipe({
  name: 'tra',
  standalone: true,
  pure: false,
})
export class DfxTrA extends AsyncTranslatePipe implements PipeTransform {
  autoTranslate = dfxAutoTranslate$();

  transform(key: string): string {
    if (!this.translation) {
      this.autoTranslate(key).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((translation) => {
        this.translation = translation;
        this.ref.markForCheck();
      });
    }

    return this.translation ?? '';
  }
}
