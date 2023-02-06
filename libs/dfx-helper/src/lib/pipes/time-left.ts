import {Pipe, PipeTransform} from '@angular/core';
import {d_timeLeft, DateInput} from 'dfts-helper';

@Pipe({
  name: 'd_timeLeft',
  standalone: true,
  pure: true,
})
export class DfxTimeLeftPipe implements PipeTransform {
  transform(date: DateInput, start: DateInput): string {
    return d_timeLeft(date, start);
  }
}
