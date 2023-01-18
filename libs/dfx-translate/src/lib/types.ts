import {Provider} from '@angular/core';

export type translationFile = {[key: string]: string};
export type autoTranslationResponse = {translatedText: string};

export enum TranslateFeatureKind {
  DEFAULT_LANGUAGE,
  DEFAULT_UNDEFINED_OR_NULL_BOOLEAN_TO,
  ASSETS_PATH,
  REMEMBER_LANGUAGE,
  AUTO_TRANSLATED_LANGUAGES,
  LIBRE_TRANSLATE,
}

export declare interface TranslateFeature<KindT extends TranslateFeatureKind> {
  kind: KindT;
  providers: Provider[];
}

export declare type DefaultLanguageFeature = TranslateFeature<TranslateFeatureKind.DEFAULT_LANGUAGE>;
export declare type DefaultUndefinedOrNullBooleanToFeature = TranslateFeature<TranslateFeatureKind.DEFAULT_UNDEFINED_OR_NULL_BOOLEAN_TO>;
export declare type AssetsPathFeature = TranslateFeature<TranslateFeatureKind.ASSETS_PATH>;
export declare type RememberLanguageFeature = TranslateFeature<TranslateFeatureKind.REMEMBER_LANGUAGE>;
export declare type AutoTranslatedLanguagesFeature = TranslateFeature<TranslateFeatureKind.AUTO_TRANSLATED_LANGUAGES>;
export declare type LibreTranslateFeature = TranslateFeature<TranslateFeatureKind.LIBRE_TRANSLATE>;

export declare type TranslateFeatures =
  | DefaultLanguageFeature
  | DefaultUndefinedOrNullBooleanToFeature
  | AssetsPathFeature
  | RememberLanguageFeature
  | AutoTranslatedLanguagesFeature
  | LibreTranslateFeature;
