import { Provider } from "@angular/core";

export enum IconFeatureKind {
  ICON_PICK,
  WIDTH,
  HEIGHT,
  COLOR,
}

declare interface IconFeature<KindT extends IconFeatureKind> {
  kind: KindT;
  providers: Provider[];
}

export declare type IconPickFeature = IconFeature<IconFeatureKind.ICON_PICK>;
export declare type IconWidthFeature = IconFeature<IconFeatureKind.WIDTH>;
export declare type IconHeightFeature = IconFeature<IconFeatureKind.HEIGHT>;
export declare type IconColorFeature = IconFeature<IconFeatureKind.COLOR>;

export declare type IconFeatures = IconPickFeature | IconWidthFeature | IconHeightFeature | IconColorFeature;