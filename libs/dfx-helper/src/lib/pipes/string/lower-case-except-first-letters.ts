import {Pipe, PipeTransform} from '@angular/core';
import {lowerCaseExceptFirstLetters, UndefinedOrNullOr} from 'dfts';

@Pipe({
  name: 'lowerCaseExceptFirstLetters',
  standalone: true,
  pure: true,
})
export class DfxLowerCaseExceptFirstLetters implements PipeTransform {
  transform(text: UndefinedOrNullOr<string>): string {
    return lowerCaseExceptFirstLetters(text);
  }
}
