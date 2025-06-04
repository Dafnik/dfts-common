import { InjectionToken } from '@angular/core';

import { ColorValueHex, QRCodeErrorCorrectionLevel, QRCodeVersion } from 'dfts-qrcode';

import { QRCodeElementType } from './types';

export const QRCODE_ALLOW_EMPTY_STRING = new InjectionToken<boolean>('QRCODE_ALLOW_EMPTY_STRING', {
  factory: () => false,
});

export const QRCODE_COLOR_DARK = new InjectionToken<ColorValueHex>('QRCODE_COLOR_DARK', {
  factory: () => '#000000',
});

export const QRCODE_COLOR_LIGHT = new InjectionToken<ColorValueHex>('QRCODE_COLOR_LIGHT', {
  factory: () => '#ffffff',
});

export const QRCODE_CSS_CLASS = new InjectionToken<string>('QRCODE_CSS_CLASS', {
  factory: () => 'qrcode',
});

export const QRCODE_ELEMENT_TYPE = new InjectionToken<QRCodeElementType>('QRCODE_ELEMENT_TYPE', {
  factory: () => 'img',
});

export const QRCODE_ERROR_CORRECTION_LEVEL = new InjectionToken<QRCodeErrorCorrectionLevel>('QRCODE_ERROR_CORRECTION_LEVEL', {
  factory: () => 'L',
});

export const QRCODE_MARGIN = new InjectionToken<number>('QRCODE_MARGIN', {
  factory: () => 4,
});

export const QRCODE_IMAGE_SRC = new InjectionToken<string | undefined>('QRCODE_IMAGE_SRC', {
  factory: () => undefined,
});

export const QRCODE_IMAGE_HEIGHT = new InjectionToken<number>('QRCODE_IMAGE_HEIGHT', {
  factory: () => 40,
});

export const QRCODE_IMAGE_WIDTH = new InjectionToken<number>('QRCODE_IMAGE_WIDTH', {
  factory: () => 40,
});

export const QRCODE_VERSION = new InjectionToken<QRCodeVersion>('QRCODE_VERSION', {
  factory: () => -1,
});

export const QRCODE_SIZE = new InjectionToken<number>('QRCODE_WIDTH', {
  factory: () => 5,
});
