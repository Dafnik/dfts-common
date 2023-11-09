import { Pipe, PipeTransform } from '@angular/core';
import { s_truncate, UndefinedOrNullOr } from 'dfts-helper';

@Pipe({
  name: 's_truncate',
  standalone: true,
  pure: true,
})
export class DfxTruncatePipe implements PipeTransform {
  transform(text: UndefinedOrNullOr<string>, maxWords = 10, suffix: UndefinedOrNullOr<string> = '...'): string {
    return s_truncate(text, maxWords, suffix);
  }
}
