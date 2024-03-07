import { dfxTranslate, dfxAutoTranslate$, dfxTranslateSetLanguage, dfxTranslate$ } from './service';

export type translationFile = { [key: string]: string | undefined };
export type autoTranslationResponse = { translatedText: string };

export const TRANSLATE_LOCALSTORAGE_KEY = 'language';

export type dfxTranslateFn$ = ReturnType<typeof dfxTranslate$>;
export type dfxTranslateFn = ReturnType<typeof dfxTranslate>;
export type dfxTranslateSetLanguageFn = ReturnType<typeof dfxTranslateSetLanguage>;
export type dfxAutoTranslateFn$ = ReturnType<typeof dfxAutoTranslate$>;
