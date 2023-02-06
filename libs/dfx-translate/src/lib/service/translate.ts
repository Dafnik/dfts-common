import {firstValueFrom} from 'rxjs';
import {translationKeys} from '../translationKeys';
import {dfxTranslate$} from './rx-translate';

export function dfxTranslate(): (key: translationKeys) => Promise<string> {
  const translate$ = dfxTranslate$();

  return (key: translationKeys): Promise<string> => firstValueFrom(translate$(key));
}
