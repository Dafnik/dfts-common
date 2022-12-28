import {Pipe, PipeTransform} from '@angular/core';
import {s_isUrl, UndefinedOrNullOr} from 'dfts-helper';

@Pipe({
  name: 'isUrl',
  standalone: true,
  pure: true,
})
export class DfxIsUrl implements PipeTransform {
  transform(text: UndefinedOrNullOr<string>): boolean {
    return s_isUrl(text);
  }
}
