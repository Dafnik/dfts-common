import {Pipe, PipeTransform} from '@angular/core';
import {DateInput, timespan} from 'dfts';

@Pipe({
  name: 'timespan',
  standalone: true,
  pure: true,
})
export class DfxTimeSpan implements PipeTransform {
  transform(dateNow: DateInput, dateFuture: DateInput): string {
    return timespan(dateNow, dateFuture);
  }
}
