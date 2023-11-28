import { inject, Provider } from '@angular/core';
import {
  IconCDNFeature,
  IconColorFeature,
  IconFeatureKind,
  IconFeatures,
  IconHeightFeature,
  IconPickFeature,
  IconWidthFeature,
} from './icons.feature';
import { ICON_COLOR, ICON_HEIGHT, ICON_WIDTH, ICONS_LOADER, ICONS_PICKED } from './icons.config';
import { ColorValueHex, IconsType } from './types';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpContext, HttpHeaders } from "@angular/common/http";
import { toEscapedName } from './internal/toEscapedName';
import { ICON_CACHE_INTERCEPTOR } from "./icons-cache.interceptor";

export function provideBi(...features: IconFeatures[]): Provider[] {
  return features.map((it) => it.providers);
}

export function provideIcons(icons: IconsType): Provider {
  return { provide: ICONS_PICKED, multi: true, useValue: icons };
}

export function provideLocalIconsLoader(): Provider {
  return {
    provide: ICONS_LOADER,
    useFactory: (): ((name: string) => Observable<string | undefined>) => {
      const pickedIcons: IconsType = Object.assign({}, ...(inject(ICONS_PICKED) as unknown as object[])) as IconsType;
      return (name: string) => of(pickedIcons[toEscapedName(name)] || undefined);
    },
  };
}

export function provideCDNIconsLoader(...cdnUrls: string[]): Provider {
  const randomCDNUrl = cdnUrls[Math.floor(Math.random() * cdnUrls.length)];
  return {
    provide: ICONS_LOADER,
    useFactory: (): ((name: string) => Observable<string | undefined>) => {
      const httpClient = inject(HttpClient);

      return (name: string): Observable<string | undefined> => {
        return httpClient.get<string>(`${randomCDNUrl}/${name}.svg`, {
          headers: new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8'),
          context: new HttpContext().set(ICON_CACHE_INTERCEPTOR, true),
          // @ts-expect-error Weird angular things
          responseType: 'text',
        }) as unknown as Observable<string | undefined>;
      };
    },
  };
}

export function withCDN(...cdnUrls: string[]): IconCDNFeature {
  return {
    kind: IconFeatureKind.ICON_CDN,
    providers: [
      provideCDNIconsLoader(...cdnUrls)
    ],
  };
}

export function withIcons(icons: IconsType): IconPickFeature {
  return {
    kind: IconFeatureKind.ICON_PICK,
    providers: [provideIcons(icons), provideLocalIconsLoader()],
  };
}

export function withWidth(width: string): IconWidthFeature {
  return {
    kind: IconFeatureKind.WIDTH,
    providers: [{ provide: ICON_WIDTH, useValue: width }],
  };
}

export function withHeight(height: string): IconHeightFeature {
  return {
    kind: IconFeatureKind.HEIGHT,
    providers: [{ provide: ICON_HEIGHT, useValue: height }],
  };
}

export function withColor(color: ColorValueHex): IconColorFeature {
  return {
    kind: IconFeatureKind.COLOR,
    providers: [{ provide: ICON_COLOR, useValue: color }],
  };
}
