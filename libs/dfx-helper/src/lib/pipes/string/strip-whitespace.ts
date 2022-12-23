import {Pipe, PipeTransform} from '@angular/core';
import {s_stripWhitespace, UndefinedOrNullOr} from 'dfts';

@Pipe({
  name: 'stripWhitespace',
  standalone: true,
  pure: true,
})
export class DfxStripWhitespace implements PipeTransform {
  transform(text: UndefinedOrNullOr<string>): string {
    return s_stripWhitespace(text);
  }
}
