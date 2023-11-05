import { InjectionToken } from "@angular/core";

import { ColorValueHex } from "./types/color.type";
import { IconsType } from "./types/icons.type";

export const ICONS_PICKED = new InjectionToken<IconsType>('DFX_ICONS_PICKED', {
  factory: () => ({}),
});

export const DEFAULT_ICON_SIZE = '16';
export const DEFAULT_COLOR = "currentColor";

export const ICON_WIDTH = new InjectionToken<string>('DFX_ICONS_WIDTH', {
  factory: () => '16',
});

export const ICON_HEIGHT = new InjectionToken<string>('DFX_ICONS_HEIGHT', {
  factory: () => '16',
});

export const ICON_COLOR = new InjectionToken<ColorValueHex | undefined>('DFX_ICONS_COLOR', {
  factory: () => undefined,
});
