import {Pipe, PipeTransform} from '@angular/core';
import {DateInput, UIHelper} from 'dfts';

@Pipe({
  name: 'timeleft',
  standalone: true,
  pure: true,
})
export class DfxTimeLeft implements PipeTransform {
  transform(date: DateInput, start: DateInput): string {
    return UIHelper.getTimeLeft(date, start);
  }
}
