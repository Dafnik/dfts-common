import { Pipe, PipeTransform} from '@angular/core';
import { translationKeys } from '../translationKeys';
import { dfxTranslate$ } from '../service/rx-translate';
import { AsyncTranslatePipe } from './async.pipe';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Pipe({
  name: 'tr',
  standalone: true,
  pure: false,
})
export class DfxTr extends AsyncTranslatePipe implements PipeTransform {
  translate = dfxTranslate$();

  transform(key: translationKeys): string {
    if (!this.translation) {
      this.translate(key).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((translation) => {
        this.translation = translation;
        this.ref.markForCheck();
      });
    }

    return this.translation ?? '';
  }
}
