import { Pipe, PipeTransform } from '@angular/core';

import { s_isUrl } from 'dfts-helper';

@Pipe({
  name: 's_isUrl',
  standalone: true,
  pure: true,
})
export class DfxIsUrlPipe implements PipeTransform {
  transform(text: string | undefined | null): boolean {
    return s_isUrl(text);
  }
}
