import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';

export const TRANSLATIONS_EN = {
  testkey1: 'testanswer1',
  testkey2: 'testanswer2',
  testkey3: 'testanswer3',
  testkey4: 'testanswer4',
};

export const TRANSLATIONS_DE = {
  testkey1: 'testanswer1_DE',
  testkey2: 'testanswer2_DE',
};

export const TRANSLATIONS_DE_AUTO = {
  testkey3: 'testanswer3_DE_auto',
  testkey4: 'testanswer4_DE_auto',
};

export const serviceStub = {
  get: (path: string) =>
    of(path === 'assets/i18n/en.json' ? TRANSLATIONS_EN : path === 'assets/i18n/de.json' ? TRANSLATIONS_DE : TRANSLATIONS_DE_AUTO),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  put: (url: string, body: unknown) => of({translatedText: 'Hallo'}),
} as HttpClient;
