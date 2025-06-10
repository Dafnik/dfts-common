import { Provider } from '@angular/core';

import { Observable, from } from 'rxjs';

import fs from 'node:fs/promises';

import { ICONS_LOADER } from './icons.config';

const FETCH_DELAY = 50;

export function getAttributeValue(text: string | undefined, attributeName: string): string | undefined {
  const match = text?.match(new RegExp(attributeName + '="([^"]+)"'));
  return match ? match[1] : undefined;
}

export async function awaitTimeout(delay?: number) {
  await new Promise((resolve) => setTimeout(resolve, delay ?? FETCH_DELAY));
}

export async function getIcon(icon: string) {
  const it = await fs.readFile(`../../node_modules/bootstrap-icons/icons/${icon}.svg`);
  return it
    .toString()
    .replace(/<path([^>]*)\s*\/>/g, '<path$1></path>')
    .replace(/<rect([^>]*)\s*\/>/g, '<rect$1></rect>')
    .replace(/<circle([^>]*)\s*\/>/g, '<circle$1></circle>');
}

export function provideTestIconsLoader(): Provider {
  return {
    provide: ICONS_LOADER,
    useFactory: (): ((name: string) => Observable<string | undefined>) => {
      return (name: string): Observable<string | undefined> => {
        return from(fs.readFile(`../../node_modules/bootstrap-icons/icons/${name}.svg`).then((it) => it.toString()));
      };
    },
  };
}

describe('placeholder', () => {
  it('should', () => {
    expect(true).toBeTruthy();
  });
});
