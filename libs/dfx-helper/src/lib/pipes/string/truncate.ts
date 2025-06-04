import { Pipe, PipeTransform } from '@angular/core';

import { s_truncate } from 'dfts-helper';

@Pipe({
  name: 's_truncate',
  standalone: true,
  pure: true,
})
export class DfxTruncatePipe implements PipeTransform {
  transform(text: string | undefined | null, maxWords = 10, suffix: string | undefined | null = '...'): string {
    return s_truncate(text, maxWords, suffix);
  }
}
