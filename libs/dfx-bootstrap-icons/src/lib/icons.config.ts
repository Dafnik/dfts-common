import { InjectionToken } from '@angular/core';

import { Observable } from 'rxjs';

import { ColorValueHex } from './types';

export const ICONS_LOADER = new InjectionToken<(name: string) => Observable<string | undefined>>('DFX_ICONS_LOADER');

export const DEFAULT_ICON_SIZE = '16';
export const DEFAULT_COLOR = 'currentColor';

export const ICON_WIDTH = new InjectionToken<string>('DFX_ICONS_WIDTH', {
  factory: () => DEFAULT_ICON_SIZE,
});

export const ICON_HEIGHT = new InjectionToken<string>('DFX_ICONS_HEIGHT', {
  factory: () => DEFAULT_ICON_SIZE,
});

export const ICON_COLOR = new InjectionToken<ColorValueHex | undefined>('DFX_ICONS_COLOR', {
  factory: () => undefined,
});

export const ICON_SIZE = new InjectionToken<string | undefined>('DFX_ICONS_SIZE', {
  factory: () => undefined,
});
