import {Pipe, PipeTransform} from '@angular/core';
import {s_isUrl, UndefinedOrNullOr} from 'dfts-helper';

@Pipe({
  name: 's_isUrl',
  standalone: true,
  pure: true,
})
export class DfxIsUrlPipe implements PipeTransform {
  transform(text: UndefinedOrNullOr<string>): boolean {
    return s_isUrl(text);
  }
}
