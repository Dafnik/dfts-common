import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, distinctUntilChanged, Observable, of, shareReplay, switchMap} from 'rxjs';
import {TRANSLATE_LOCALSTORAGE_KEY, translationFile} from '../types';
import {TRANSLATE_DEFAULT_LANGUAGE} from '../features/default-language/default-language';
import {TRANSLATE_ASSETS_PATH} from '../features/assets-path/assets-path';
import {TRANSLATE_REMEMBER_LANGUAGE} from '../features/remember-language/remember-language';
import {TRANSLATE_AUTO_TRANSLATED_LANGUAGES} from '../features/auto-translated-languages/auto-translated-languages';

@Injectable({
  providedIn: 'root',
})
export class TranslateStore {
  private httpClient = inject(HttpClient);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private rememberLanguage = inject(TRANSLATE_REMEMBER_LANGUAGE);
  private defaultLanguage = inject(TRANSLATE_DEFAULT_LANGUAGE);
  private assetsPath = inject(TRANSLATE_ASSETS_PATH);
  private autoTranslatedLanguages = inject(TRANSLATE_AUTO_TRANSLATED_LANGUAGES);
  readonly selectedLanguage: BehaviorSubject<string> = new BehaviorSubject<string>(
    this.isBrowser
      ? this.rememberLanguage
        ? localStorage.getItem(TRANSLATE_LOCALSTORAGE_KEY) ?? this.defaultLanguage
        : this.defaultLanguage
      : this.defaultLanguage,
  );

  readonly selectedLanguage$ = this.selectedLanguage.pipe(distinctUntilChanged());

  readonly translations$: Observable<translationFile> = this.selectedLanguage$.pipe(
    switchMap((language) => this.httpClient.get<translationFile>(`${this.assetsPath}${language}.json`)),
    catchError(() => of({})),
    shareReplay(1),
  );
  readonly autoGeneratedTranslations$: Observable<translationFile> = this.selectedLanguage$.pipe(
    switchMap((language) =>
      this.autoTranslatedLanguages.includes(language)
        ? this.httpClient.get<translationFile>(`${this.assetsPath}${language}_auto.json`)
        : of({}),
    ),
    catchError(() => of({})),
    shareReplay(1),
  );
}
