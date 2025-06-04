import { Pipe, PipeTransform } from '@angular/core';

import { s_stripWhitespace } from 'dfts-helper';

@Pipe({
  name: 's_stripWhitespace',
  standalone: true,
  pure: true,
})
export class DfxStripWhitespacePipe implements PipeTransform {
  transform(text: string | undefined | null): string {
    return s_stripWhitespace(text);
  }
}
