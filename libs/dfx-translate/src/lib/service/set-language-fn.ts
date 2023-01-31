import {isPlatformBrowser} from '@angular/common';
import {inject, PLATFORM_ID} from '@angular/core';
import {TranslateStore} from './translate.store';
import {TRANSLATE_LOCALSTORAGE_KEY} from '../types';
import {TRANSLATE_REMEMBER_LANGUAGE} from '../features/remember-language/remember-language';

export function dfxTranslateSetLanguageFn(): (language: string) => void {
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  const rememberLanguage = inject(TRANSLATE_REMEMBER_LANGUAGE);
  const store = inject(TranslateStore);

  return (language: string): void => {
    store.selectedLanguage.next(language);
    if (isBrowser && rememberLanguage) {
      localStorage.setItem(TRANSLATE_LOCALSTORAGE_KEY, language);
    }
  };
}
