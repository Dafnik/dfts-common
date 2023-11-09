import { Pipe, PipeTransform } from '@angular/core';
import { s_lowerCaseAllExceptFirstLetter, UndefinedOrNullOr } from 'dfts-helper';

@Pipe({
  name: 's_lowerCaseAllExceptFirstLetter',
  standalone: true,
  pure: true,
})
export class DfxLowerCaseExceptFirstLettersPipe implements PipeTransform {
  transform(text: UndefinedOrNullOr<string>): string {
    return s_lowerCaseAllExceptFirstLetter(text);
  }
}
