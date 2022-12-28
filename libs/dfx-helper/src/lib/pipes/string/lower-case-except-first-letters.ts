import {Pipe, PipeTransform} from '@angular/core';
import {s_lowerCaseAllExceptFirstLetter, UndefinedOrNullOr} from '@dfts-common/dfts-helper';

@Pipe({
  name: 'lowerCaseExceptFirstLetters',
  standalone: true,
  pure: true,
})
export class DfxLowerCaseExceptFirstLetters implements PipeTransform {
  transform(text: UndefinedOrNullOr<string>): string {
    return s_lowerCaseAllExceptFirstLetter(text);
  }
}
