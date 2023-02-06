import {OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {translationKeys} from '../translationKeys';
import {dfxTranslate$} from '../service/rx-translate';
import {AsyncTranslatePipe} from './async.pipe';

@Pipe({
  name: 'tr',
  standalone: true,
  pure: false,
})
export class DfxTr extends AsyncTranslatePipe implements PipeTransform, OnDestroy {
  translate = dfxTranslate$();

  transform(key: translationKeys): string {
    if (!this.translation) {
      this.translationSubscription = this.translate(key).subscribe((translation) => {
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
