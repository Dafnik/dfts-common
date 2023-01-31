import {inject, OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {dfxTranslateFn} from '../service/translate-fn';
import {AsyncTranslatePipe} from './async.pipe';
import {TRANSLATE_DEFAULT_UNDEFINED_OR_NULL_BOOLEAN_TO} from '../features/default-undefined-boolean-to/default-undefined-boolean-to';

@Pipe({
  name: 'trb',
  standalone: true,
  pure: true,
})
export class DfxTrB extends AsyncTranslatePipe implements PipeTransform, OnDestroy {
  defaultUndefinedOrNullBooleanTo = inject(TRANSLATE_DEFAULT_UNDEFINED_OR_NULL_BOOLEAN_TO);

  translate = dfxTranslateFn();

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
      this.translationSubscription = this.translate(key).subscribe((translation) => {
        this.translation = translation;
        this.ref.markForCheck();
      });
    }

    return this.translation ?? '';
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
