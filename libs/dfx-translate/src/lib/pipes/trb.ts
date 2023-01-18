import {inject, Pipe, PipeTransform} from '@angular/core';

import {TranslateService} from '../service/translate.service';
import {TRANSLATE_DEFAULT_UNDEFINED_OR_NULL_BOOLEAN_TO} from '../config/translate.config';

@Pipe({
  name: 'trb',
  standalone: true,
  pure: true,
})
export class DfxTrB implements PipeTransform {
  defaultUndefinedOrNullBooleanTo = inject(TRANSLATE_DEFAULT_UNDEFINED_OR_NULL_BOOLEAN_TO);

  constructor(private translator: TranslateService) {}

  transform(value?: boolean | null): string {
    if (value === undefined || value === null) {
      if (this.defaultUndefinedOrNullBooleanTo === null) {
        return '';
      }
      return this.translator.translate(this.defaultUndefinedOrNullBooleanTo ? 'TRUE' : 'FALSE');
    }

    return this.translator.translate(value ? 'TRUE' : 'FALSE');
  }
}
