import { Provider } from '@angular/core';

export enum IconFeatureKind {
  ICON_PICK,
  ICON_CDN,
  WIDTH,
  HEIGHT,
  COLOR,
  SIZE
}

declare interface IconFeature<KindT extends IconFeatureKind> {
  kind: KindT;
  providers: Provider[];
}

export declare type IconPickFeature = IconFeature<IconFeatureKind.ICON_PICK>;
export declare type IconCDNFeature = IconFeature<IconFeatureKind.ICON_CDN>;
export declare type IconWidthFeature = IconFeature<IconFeatureKind.WIDTH>;
export declare type IconHeightFeature = IconFeature<IconFeatureKind.HEIGHT>;
export declare type IconColorFeature = IconFeature<IconFeatureKind.COLOR>;
export declare type IconSizeFeature = IconFeature<IconFeatureKind.SIZE>;

export declare type IconFeatures = IconPickFeature | IconCDNFeature | IconWidthFeature | IconHeightFeature | IconColorFeature | IconSizeFeature;
