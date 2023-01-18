import {Pipe, PipeTransform} from '@angular/core';
import {Observable} from 'rxjs';

import {translationKeys} from '../translationKeys';
import {TranslateService} from '../service/translate.service';

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
