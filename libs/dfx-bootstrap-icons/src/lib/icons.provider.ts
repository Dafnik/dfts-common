import { EnvironmentProviders, makeEnvironmentProviders, Provider } from "@angular/core";
import {
  IconColorFeature,
  IconFeatureKind,
  IconFeatures,
  IconHeightFeature,
  IconPickFeature,
  IconWidthFeature
} from "./icons.feature";
import { ICON_COLOR, ICON_HEIGHT, ICON_WIDTH, ICONS_PICKED } from "./icons.config";
import { ColorValueHex, IconsType } from "./types";

export function provideDfxBootstrapIcons(...features: IconFeatures[]): EnvironmentProviders {
  return makeEnvironmentProviders([
    features.map((it) => it.providers),
  ]);
}

export function provideIcons(icons: IconsType): Provider{
  return {provide: ICONS_PICKED, multi: true, useValue: icons}
}

export function withIcons(icons: IconsType): IconPickFeature {
  return {
    kind: IconFeatureKind.ICON_PICK,
    providers: [provideIcons(icons)],
  };
}

export function withWidth(width: string): IconWidthFeature {
  return {
    kind: IconFeatureKind.WIDTH,
    providers: [{provide: ICON_WIDTH, useValue: width}],
  };
}

export function withHeight(height: string): IconHeightFeature {
  return {
    kind: IconFeatureKind.HEIGHT,
    providers: [{provide: ICON_HEIGHT, useValue: height}],
  };
}

export function withColor(color: ColorValueHex): IconColorFeature {
  return {
    kind: IconFeatureKind.COLOR,
    providers: [{provide: ICON_COLOR, useValue: color}],
  };
}
