import { Pipe, PipeTransform } from '@angular/core';

import { s_cut } from 'dfts-helper';

@Pipe({
  name: 's_cut',
  standalone: true,
  pure: true,
})
export class DfxCutPipe implements PipeTransform {
  transform(text: string | undefined | null, maxLength = 10, suffix: string | undefined | null = '...'): string {
    return s_cut(text, maxLength, suffix);
  }
}
