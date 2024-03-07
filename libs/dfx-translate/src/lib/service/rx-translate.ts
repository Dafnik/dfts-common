import { inject, InjectionToken } from '@angular/core';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { TranslateStore } from './translate.store';
import { translationKeys } from '../translationKeys';
import { TRANSLATE_DEFAULT_UNDEFINED_KEY_TO } from '../features';

function _dfxTranslate$(): (key: translationKeys) => Observable<string> {
  const store = inject(TranslateStore);
  const defaultUndefinedKeyTo = inject(TRANSLATE_DEFAULT_UNDEFINED_KEY_TO);

  return (key: translationKeys): Observable<string> => {
    if (!key) {
      return of(defaultUndefinedKeyTo);
    }

    return combineLatest([
      store.translations$.pipe(map((translations) => translations[key])),
      store.autoGeneratedTranslations$.pipe(map((translations) => translations[key])),
    ]).pipe(switchMap(([translation, autoGeneratedTranslation]) => of(translation ?? autoGeneratedTranslation ?? key)));
  };
}

const DFX_TRANSLATE$ = new InjectionToken('dfxTranslate$', {
  providedIn: 'root',
  factory: () => _dfxTranslate$(),
});

export function dfxTranslate$(): ReturnType<typeof _dfxTranslate$> {
  return inject(DFX_TRANSLATE$);
}
