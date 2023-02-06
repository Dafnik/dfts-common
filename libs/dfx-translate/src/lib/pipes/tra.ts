import {OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {AsyncTranslatePipe} from './async.pipe';
import {dfxAutoTranslate$} from '../service/rx-auto-translate';

@Pipe({
  name: 'tra',
  standalone: true,
  pure: false,
})
export class DfxTrA extends AsyncTranslatePipe implements PipeTransform, OnDestroy {
  autoTranslate = dfxAutoTranslate$();

  transform(key: string): string {
    if (!this.translation) {
      this.translationSubscription = this.autoTranslate(key).subscribe((translation) => {
        this.translation = translation;
        this.ref.markForCheck();
      });
    }

    return this.translation ?? '';
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
