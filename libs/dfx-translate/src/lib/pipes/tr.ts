import {Pipe, PipeTransform} from '@angular/core';

import {TranslateService} from '../service/translate.service';
import {translationKeys} from '../translationKeys';

@Pipe({
  name: 'tr',
  standalone: true,
  pure: true,
})
export class DfxTr implements PipeTransform {
  constructor(private translator: TranslateService) {}

  transform(key: translationKeys, printUndefined = true): string {
    return this.translator.translate(key, printUndefined);
  }
}
