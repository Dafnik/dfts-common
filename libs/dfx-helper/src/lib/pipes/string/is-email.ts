import {Pipe, PipeTransform} from '@angular/core';
import {isEmail, UndefinedOrNullOr} from 'dfts';

@Pipe({
  name: 'isEmail',
  standalone: true,
  pure: true,
})
export class DfxIsEmail implements PipeTransform {
  transform(text: UndefinedOrNullOr<string>): boolean {
    return isEmail(text);
  }
}
