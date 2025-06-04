import { Pipe, PipeTransform } from '@angular/core';

import { DateInput, d_timespan } from 'dfts-helper';

@Pipe({
  name: 'd_timespan',
  standalone: true,
  pure: true,
})
export class DfxTimeSpanPipe implements PipeTransform {
  transform(dateNow: DateInput, dateFuture: DateInput): string {
    return d_timespan(dateNow, dateFuture);
  }
}
