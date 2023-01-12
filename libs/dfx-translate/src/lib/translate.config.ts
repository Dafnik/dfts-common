import {InjectionToken} from '@angular/core';

export interface TranslateConfig {
  defaultLanguage?: string;
  defaultUndefinedOrNullBooleanTo?: boolean | null;
  assetsPath?: string;
  useLocalStorage?: boolean;
  languagesWithAutoTranslation?: string[];
  libreTranslateInstanceUrl?: string;
}

export const TRANSLATE_CONFIG = new InjectionToken('TRANSLATE_CONFIG');
