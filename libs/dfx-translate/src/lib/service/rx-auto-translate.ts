import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {first, map, Observable, of, switchMap} from 'rxjs';
import {TranslateStore} from './translate.store';
import {autoTranslationResponse} from '../types';
import {TRANSLATE_DEFAULT_LANGUAGE} from '../features/default-language/default-language';
import {TRANSLATE_DEFAULT_UNDEFINED_KEY_TO} from '../features/default-undefined-key-to/default-undefined-key-to';
import {TRANSLATE_LIBRE_TRANSLATE_INSTANCE_URL} from '../features/libre-translate/libre-translate';

export function dfxAutoTranslate$(): (key: string) => Observable<string> {
  const httpClient = inject(HttpClient);
  const store = inject(TranslateStore);
  const defaultLanguage = inject(TRANSLATE_DEFAULT_LANGUAGE);
  const libreTranslateInstanceUrl = inject(TRANSLATE_LIBRE_TRANSLATE_INSTANCE_URL);
  const defaultUndefinedKeyTo = inject(TRANSLATE_DEFAULT_UNDEFINED_KEY_TO);

  return (key: string): Observable<string> => {
    if (!key) {
      return of(defaultUndefinedKeyTo);
    }

    if (libreTranslateInstanceUrl) {
      return store.selectedLanguage$.pipe(
        switchMap((selectedLanguage) =>
          httpClient
            .put<autoTranslationResponse>(`${libreTranslateInstanceUrl}/translate`, {
              format: 'text',
              q: key,
              target: selectedLanguage,
              source: defaultLanguage,
            })
            .pipe(map((it) => it.translatedText))
        ),
        first()
      );
    }
    return of('Feature disabled');
  };
}
