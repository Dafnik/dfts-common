import { dfxTranslate$ } from './service/rx-translate';
import { dfxTranslateSetLanguage } from './service/set-language';
import { dfxAutoTranslate$ } from './service/rx-auto-translate';
import { dfxTranslate } from './service/translate';

export type translationFile = { [key: string]: string | undefined };
export type autoTranslationResponse = { translatedText: string };

export const TRANSLATE_LOCALSTORAGE_KEY = 'language';

export type dfxTranslateFn$ = ReturnType<typeof dfxTranslate$>;
export type dfxTranslateFn = ReturnType<typeof dfxTranslate>;
export type dfxTranslateSetLanguageFn = ReturnType<typeof dfxTranslateSetLanguage>;
export type dfxAutoTranslateFn$ = ReturnType<typeof dfxAutoTranslate$>;
