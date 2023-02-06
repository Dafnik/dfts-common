import {Provider} from '@angular/core';
import {DefaultLanguageFeature} from './default-language/default-language';
import {DefaultUndefinedOrNullBooleanToFeature} from './default-undefined-boolean-to/default-undefined-boolean-to';
import {DefaultUndefinedKeyToFeature} from './default-undefined-key-to/default-undefined-key-to';
import {AssetsPathFeature} from './assets-path/assets-path';
import {RememberLanguageFeature} from './remember-language/remember-language';
import {AutoTranslatedLanguagesFeature} from './auto-translated-languages/auto-translated-languages';
import {LibreTranslateFeature} from './libre-translate/libre-translate';

export enum TranslateFeatureKind {
  DEFAULT_LANGUAGE,
  DEFAULT_UNDEFINED_OR_NULL_BOOLEAN_TO,
  DEFAULT_UNDEFINED_KEY_TO,
  ASSETS_PATH,
  REMEMBER_LANGUAGE,
  AUTO_TRANSLATED_LANGUAGES,
  LIBRE_TRANSLATE,
}

export declare interface TranslateFeature<KindT extends TranslateFeatureKind> {
  kind: KindT;
  providers: Provider[];
}

export declare type TranslateFeatures =
  | DefaultLanguageFeature
  | DefaultUndefinedOrNullBooleanToFeature
  | DefaultUndefinedKeyToFeature
  | AssetsPathFeature
  | RememberLanguageFeature
  | AutoTranslatedLanguagesFeature
  | LibreTranslateFeature;
