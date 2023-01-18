import {InjectionToken} from '@angular/core';

export interface TranslateConfig {
  defaultLanguage?: string;
  defaultUndefinedOrNullBooleanTo?: boolean | null;
  assetsPath?: string;
  useLocalStorage?: boolean;
  languagesWithAutoTranslation?: string[];
  libreTranslateInstanceUrl?: string;
}

export const TRANSLATE_DEFAULT_LANGUAGE = new InjectionToken<string>('TRANSLATE_DEFAULT_LANGUAGE', {
  factory: () => 'en',
});

export const TRANSLATE_DEFAULT_UNDEFINED_OR_NULL_BOOLEAN_TO = new InjectionToken<boolean | null>(
  'TRANSLATE_DEFAULT_UNDEFINED_OR_NULL_BOOLEAN_TO',
  {
    factory: () => null,
  }
);

export const TRANSLATE_ASSETS_PATH = new InjectionToken<string>('TRANSLATE_ASSETS_PATH', {
  factory: () => 'assets/i18n/',
});

export const TRANSLATE_REMEMBER_LANGUAGE = new InjectionToken<boolean>('TRANSLATE_REMEMBER_LANGUAGE', {
  factory: () => true,
});

export const TRANSLATE_AUTO_TRANSLATED_LANGUAGES = new InjectionToken<string[]>('TRANSLATE_AUTO_TRANSLATED_LANGUAGES', {
  factory: () => [],
});

export const TRANSLATE_LIBRE_TRANSLATE_INSTANCE_URL = new InjectionToken<string | undefined>('TRANSLATE_LIBRE_TRANSLATE_INSTANCE_URL', {
  factory: () => undefined,
});
