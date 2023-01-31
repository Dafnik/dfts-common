import {dfxTranslateFn} from './service/translate-fn';
import {dfxTranslateSetLanguageFn} from './service/set-language-fn';
import {dfxAutoTranslateFn} from './service/auto-translate-fn';

export type translationFile = {[key: string]: string | undefined};
export type autoTranslationResponse = {translatedText: string};

export const TRANSLATE_LOCALSTORAGE_KEY = 'language';

export type dfxTranslate = ReturnType<typeof dfxTranslateFn>;
export type dfxTranslateSetLanguage = ReturnType<typeof dfxTranslateSetLanguageFn>;
export type dfxAutoTranslate = ReturnType<typeof dfxAutoTranslateFn>;
