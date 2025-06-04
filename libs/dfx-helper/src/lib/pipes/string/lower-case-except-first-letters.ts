import { Pipe, PipeTransform } from '@angular/core';

import { s_lowerCaseAllExceptFirstLetter } from 'dfts-helper';

@Pipe({
  name: 's_lowerCaseAllExceptFirstLetter',
  standalone: true,
  pure: true,
})
export class DfxLowerCaseExceptFirstLettersPipe implements PipeTransform {
  transform(text: string | undefined | null): string {
    return s_lowerCaseAllExceptFirstLetter(text);
  }
}
