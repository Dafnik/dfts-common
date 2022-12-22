import {Pipe, PipeTransform} from '@angular/core';
import {cut, UndefinedOrNullOr} from 'dfts';

@Pipe({
  name: 'cut',
  standalone: true,
  pure: true,
})
export class DfxCut implements PipeTransform {
  transform(text: UndefinedOrNullOr<string>, maxLength = 10, suffix: UndefinedOrNullOr<string> = '...'): string {
    return cut(text, maxLength, suffix);
  }
}
