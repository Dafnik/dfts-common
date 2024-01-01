import { InjectionToken } from '@angular/core';

import { ColorValueHex, IconsType } from './types';
import { Observable, of } from 'rxjs';
import { factory } from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

export const ICONS_PICKED = new InjectionToken<IconsType>('DFX_ICONS_PICKED', {
  factory: () => ({}),
});

export const ICONS_LOADER = new InjectionToken<((name: string) => Observable<string | undefined>) | undefined>('DFX_ICONS_LOADER', {
  factory: () => undefined,
});

export const DEFAULT_ICON_SIZE = '16';
export const DEFAULT_COLOR = 'currentColor';

export const ICON_WIDTH = new InjectionToken<string>('DFX_ICONS_WIDTH', {
  factory: () => '16',
});

export const ICON_HEIGHT = new InjectionToken<string>('DFX_ICONS_HEIGHT', {
  factory: () => '16',
});

export const ICON_COLOR = new InjectionToken<ColorValueHex | undefined>('DFX_ICONS_COLOR', {
  factory: () => undefined,
});
