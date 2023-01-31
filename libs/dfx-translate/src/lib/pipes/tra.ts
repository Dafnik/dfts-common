import {OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {translationKeys} from '../translationKeys';
import {AsyncTranslatePipe} from './async.pipe';
import {dfxAutoTranslateFn} from '../service/auto-translate-fn';

@Pipe({
  name: 'tra',
  standalone: true,
  pure: true,
})
export class DfxTrA extends AsyncTranslatePipe implements PipeTransform, OnDestroy {
  autoTranslate = dfxAutoTranslateFn();

  transform(key: translationKeys): string {
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
