import {Pipe, PipeTransform} from '@angular/core';
import {isUrl, UndefinedOrNullOr} from 'dfts';

@Pipe({
  name: 'isUrl',
  standalone: true,
  pure: true,
})
export class DfxIsUrl implements PipeTransform {
  transform(text: UndefinedOrNullOr<string>): boolean {
    return isUrl(text);
  }
}
