import {Pipe, PipeTransform} from '@angular/core';
import {truncate, UndefinedOrNullOr} from 'dfts';

@Pipe({
  name: 'truncate',
  standalone: true,
  pure: true,
})
export class DfxTruncate implements PipeTransform {
  transform(text: UndefinedOrNullOr<string>, maxWords = 10, suffix: UndefinedOrNullOr<string> = '...'): string {
    return truncate(text, maxWords, suffix);
  }
}
