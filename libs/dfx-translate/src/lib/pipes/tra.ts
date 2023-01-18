import {Pipe, PipeTransform} from '@angular/core';
import {Observable} from 'rxjs';

import {TranslateService} from '../service/translate.service';
import {translationKeys} from '../translationKeys';

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
