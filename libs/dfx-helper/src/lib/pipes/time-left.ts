import {Pipe, PipeTransform} from '@angular/core';
import {d_timeLeft, DateInput} from 'dfts';

@Pipe({
  name: 'timeleft',
  standalone: true,
  pure: true,
})
export class DfxTimeLeft implements PipeTransform {
  transform(date: DateInput, start: DateInput): string {
    return d_timeLeft(date, start);
  }
}
