import {ENVIRONMENT_INITIALIZER, EnvironmentProviders, inject, makeEnvironmentProviders} from '@angular/core';
import {
  TRANSLATE_ASSETS_PATH,
  TRANSLATE_AUTO_TRANSLATED_LANGUAGES,
  TRANSLATE_DEFAULT_LANGUAGE,
  TRANSLATE_DEFAULT_UNDEFINED_OR_NULL_BOOLEAN_TO,
  TRANSLATE_LIBRE_TRANSLATE_INSTANCE_URL,
  TRANSLATE_REMEMBER_LANGUAGE,
} from './config/translate.config';
import {
  AssetsPathFeature,
  AutoTranslatedLanguagesFeature,
  DefaultLanguageFeature,
  DefaultUndefinedOrNullBooleanToFeature,
  LibreTranslateFeature,
  RememberLanguageFeature,
  TranslateFeatureKind,
  TranslateFeatures,
} from './types';
import {TranslateService} from './service/translate.service';

export function provideDfxTranslate(...features: TranslateFeatures[]): EnvironmentProviders {
  console.log('dfx-translate >> configuration', features);
  return makeEnvironmentProviders([
    features.map((it) => it.providers),
    {
      provide: ENVIRONMENT_INITIALIZER,
      useValue: () => void inject(TranslateService).use(),
      multi: true,
    },
  ]);
}

export function withDefaultLanguage(language: string): DefaultLanguageFeature {
  return {
    kind: TranslateFeatureKind.DEFAULT_LANGUAGE,
    providers: [{provide: TRANSLATE_DEFAULT_LANGUAGE, useValue: language}],
  };
}

export function withDefaultUndefinedOrNullBooleanTo(
  defaultUndefinedOrNullBooleanTo: boolean | null
): DefaultUndefinedOrNullBooleanToFeature {
  return {
    kind: TranslateFeatureKind.DEFAULT_UNDEFINED_OR_NULL_BOOLEAN_TO,
    providers: [{provide: TRANSLATE_DEFAULT_UNDEFINED_OR_NULL_BOOLEAN_TO, useValue: defaultUndefinedOrNullBooleanTo}],
  };
}

export function withAssetsPath(assetsPath: string): AssetsPathFeature {
  return {
    kind: TranslateFeatureKind.ASSETS_PATH,
    providers: [{provide: TRANSLATE_ASSETS_PATH, useValue: assetsPath}],
  };
}

export function withRememberLanguage(rememberLanguage: boolean): RememberLanguageFeature {
  return {
    kind: TranslateFeatureKind.REMEMBER_LANGUAGE,
    providers: [{provide: TRANSLATE_REMEMBER_LANGUAGE, useValue: rememberLanguage}],
  };
}

export function withAutoTranslatedLanguages(autoTranslatedLanguages: string[]): AutoTranslatedLanguagesFeature {
  return {
    kind: TranslateFeatureKind.AUTO_TRANSLATED_LANGUAGES,
    providers: [{provide: TRANSLATE_AUTO_TRANSLATED_LANGUAGES, useValue: autoTranslatedLanguages}],
  };
}

export function withLibreTranslate(libreTranslateInstanceUrl?: string): LibreTranslateFeature {
  return {
    kind: TranslateFeatureKind.LIBRE_TRANSLATE,
    providers: [{provide: TRANSLATE_LIBRE_TRANSLATE_INSTANCE_URL, useValue: libreTranslateInstanceUrl}],
  };
}
