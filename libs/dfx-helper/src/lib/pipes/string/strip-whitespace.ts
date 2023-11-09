import { Pipe, PipeTransform } from '@angular/core';
import { s_stripWhitespace, UndefinedOrNullOr } from 'dfts-helper';

@Pipe({
  name: 's_stripWhitespace',
  standalone: true,
  pure: true,
})
export class DfxStripWhitespacePipe implements PipeTransform {
  transform(text: UndefinedOrNullOr<string>): string {
    return s_stripWhitespace(text);
  }
}
