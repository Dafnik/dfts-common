import {Inject, Pipe, PipeTransform} from '@angular/core';

import {TranslateService} from '../translate.service';
import {TRANSLATE_CONFIG, TranslateConfig} from '../translate.config';

@Pipe({
  name: 'trb',
  standalone: true,
  pure: true,
})
export class DfxTrB implements PipeTransform {
  defaultUndefinedOrNullBooleanTo: boolean | null = null;

  constructor(@Inject(TRANSLATE_CONFIG) config: TranslateConfig, private translator: TranslateService) {
    this.defaultUndefinedOrNullBooleanTo = config.defaultUndefinedOrNullBooleanTo ?? this.defaultUndefinedOrNullBooleanTo;
  }

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
