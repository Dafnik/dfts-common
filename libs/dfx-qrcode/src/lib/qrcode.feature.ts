import { Provider } from '@angular/core';

export enum QRCodeFeatureKind {
  ALLOW_EMPTY_STRING,
  COLOR_DARK,
  COLOR_LIGHT,
  CSS_CLASS,
  ELEMENT_TYPE,
  ERROR_CORRECTION_LEVEL,
  IMAGE,
  MARGIN,
  VERSION,
  SIZE,
}

declare interface QRCodeFeature<KindT extends QRCodeFeatureKind> {
  kind: KindT;
  providers: Provider[];
}

export declare type QRCodeAllowEmptyStringFeature = QRCodeFeature<QRCodeFeatureKind.ALLOW_EMPTY_STRING>;
export declare type QRCodeColorDarkFeature = QRCodeFeature<QRCodeFeatureKind.COLOR_DARK>;
export declare type QRCodeColorLightFeature = QRCodeFeature<QRCodeFeatureKind.COLOR_LIGHT>;
export declare type QRCodeCssClassFeature = QRCodeFeature<QRCodeFeatureKind.CSS_CLASS>;
export declare type QRCodeElementTypeFeature = QRCodeFeature<QRCodeFeatureKind.ELEMENT_TYPE>;
export declare type QRCodeErrorCorrectionLevelFeature = QRCodeFeature<QRCodeFeatureKind.ERROR_CORRECTION_LEVEL>;
export declare type QRCodeImageFeature = QRCodeFeature<QRCodeFeatureKind.IMAGE>;
export declare type QRCodeMarginFeature = QRCodeFeature<QRCodeFeatureKind.MARGIN>;
export declare type QRCodeVersionFeature = QRCodeFeature<QRCodeFeatureKind.VERSION>;
export declare type QRCodeSizeFeature = QRCodeFeature<QRCodeFeatureKind.SIZE>;

export declare type QRCodeFeatures =
  | QRCodeAllowEmptyStringFeature
  | QRCodeColorDarkFeature
  | QRCodeColorLightFeature
  | QRCodeCssClassFeature
  | QRCodeElementTypeFeature
  | QRCodeErrorCorrectionLevelFeature
  | QRCodeImageFeature
  | QRCodeMarginFeature
  | QRCodeVersionFeature
  | QRCodeSizeFeature;
