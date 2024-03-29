import { Pipe, PipeTransform } from '@angular/core';
import { s_cut, UndefinedOrNullOr } from 'dfts-helper';

@Pipe({
  name: 's_cut',
  standalone: true,
  pure: true,
})
export class DfxCutPipe implements PipeTransform {
  transform(text: UndefinedOrNullOr<string>, maxLength = 10, suffix: UndefinedOrNullOr<string> = '...'): string {
    return s_cut(text, maxLength, suffix);
  }
}
