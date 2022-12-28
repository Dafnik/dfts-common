import {Pipe, PipeTransform} from '@angular/core';
import {s_truncate, UndefinedOrNullOr} from '@dfts-common/dfts-helper';

@Pipe({
  name: 'truncate',
  standalone: true,
  pure: true,
})
export class DfxTruncate implements PipeTransform {
  transform(text: UndefinedOrNullOr<string>, maxWords = 10, suffix: UndefinedOrNullOr<string> = '...'): string {
    return s_truncate(text, maxWords, suffix);
  }
}
