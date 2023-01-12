import {Pipe, PipeTransform} from '@angular/core';

import {TranslateService} from '../translate.service';

import {translationKeys} from '../translationKeys';
import {Observable} from 'rxjs';

@Pipe({
  name: 'tra',
  standalone: true,
  pure: true,
})
export class DfxTrA implements PipeTransform {
  constructor(private translator: TranslateService) {}

  transform(key: translationKeys): Observable<string> {
    return this.translator.autoTranslate(key);
  }
}
