import { Pipe, PipeTransform } from '@angular/core';

import { s_isEmail } from 'dfts-helper';

@Pipe({
  name: 's_isEmail',
  standalone: true,
  pure: true,
})
export class DfxIsEmailPipe implements PipeTransform {
  transform(text: string | undefined | null): boolean {
    return s_isEmail(text);
  }
}
