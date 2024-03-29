import { Pipe, PipeTransform } from '@angular/core';
import { s_isEmail, UndefinedOrNullOr } from 'dfts-helper';

@Pipe({
  name: 's_isEmail',
  standalone: true,
  pure: true,
})
export class DfxIsEmailPipe implements PipeTransform {
  transform(text: UndefinedOrNullOr<string>): boolean {
    return s_isEmail(text);
  }
}
