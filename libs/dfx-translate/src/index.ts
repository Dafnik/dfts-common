export {TranslateFeatures} from './lib/features/translate.features';

export {AssetsPathFeature, withAssetsPath} from './lib/features/assets-path/assets-path';
export {
  AutoTranslatedLanguagesFeature,
  withAutoTranslatedLanguages,
} from './lib/features/auto-translated-languages/auto-translated-languages';
export {DefaultLanguageFeature, withDefaultLanguage} from './lib/features/default-language/default-language';
export {
  DefaultUndefinedOrNullBooleanToFeature,
  withDefaultUndefinedOrNullBooleanTo,
} from './lib/features/default-undefined-boolean-to/default-undefined-boolean-to';
export {DefaultUndefinedKeyToFeature, withDefaultUndefinedKeyTo} from './lib/features/default-undefined-key-to/default-undefined-key-to';
export {LibreTranslateFeature, withLibreTranslate} from './lib/features/libre-translate/libre-translate';
export {RememberLanguageFeature, withRememberLanguage} from './lib/features/remember-language/remember-language';

export {DfxTr} from './lib/pipes/tr';
export {DfxTrA} from './lib/pipes/tra';
export {DfxTrB} from './lib/pipes/trb';

export {dfxTranslate$} from './lib/service/rx-translate';
export {dfxTranslate} from './lib/service/translate';
export {dfxAutoTranslate$} from './lib/service/rx-auto-translate';
export {dfxTranslateSetLanguage} from './lib/service/set-language';
export {TranslateStore} from './lib/service/translate.store';

export {DfxTranslateModule} from './lib/translate.module';
export {provideDfxTranslate} from './lib/translate.provider';
export {translationKeys} from './lib/translationKeys';
export {
  translationFile,
  autoTranslationResponse,
  dfxAutoTranslateFn$,
  dfxTranslateFn$,
  dfxTranslateFn,
  dfxTranslateSetLanguageFn,
} from './lib/types';
