import { inject, Pipe, PipeTransform } from '@angular/core';
import { dfxTranslate$ } from '../service/rx-translate';
import { AsyncTranslatePipe } from './async.pipe';
import { TRANSLATE_DEFAULT_UNDEFINED_OR_NULL_BOOLEAN_TO } from '../features/default-undefined-boolean-to/default-undefined-boolean-to';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Pipe({
  name: 'trb',
  standalone: true,
  pure: false,
})
export class DfxTrB extends AsyncTranslatePipe implements PipeTransform {
  defaultUndefinedOrNullBooleanTo = inject(TRANSLATE_DEFAULT_UNDEFINED_OR_NULL_BOOLEAN_TO);

  translate = dfxTranslate$();

  transform(value?: boolean | null): string {
    let key = '';
    if (value === undefined || value === null) {
      if (this.defaultUndefinedOrNullBooleanTo === null) {
        return '';
      }
      key = this.defaultUndefinedOrNullBooleanTo ? 'TRUE' : 'FALSE';
    } else {
      key = value ? 'TRUE' : 'FALSE';
    }

    if (!this.translation) {
      this.translate(key)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((translation) => {
          this.translation = translation;
          this.ref.markForCheck();
        });
    }

    return this.translation ?? '';
  }
}
