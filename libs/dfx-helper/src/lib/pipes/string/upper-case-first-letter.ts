import { Pipe, PipeTransform } from '@angular/core';

import { UndefinedOrNullOr, s_upperCaseFirstLetter } from 'dfts-helper';

@Pipe({
  name: 's_upperCaseFirstLetter',
  standalone: true,
  pure: true,
})
export class DfxUpperCaseFirstLetterPipe implements PipeTransform {
  transform(text: UndefinedOrNullOr<string>): string {
    return s_upperCaseFirstLetter(text);
  }
}
