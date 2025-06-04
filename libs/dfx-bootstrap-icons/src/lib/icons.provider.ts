import { inject, Provider } from '@angular/core';
import {
  IconCDNFeature,
  IconColorFeature,
  IconFeatureKind,
  IconFeatures,
  IconHeightFeature,
  IconPickFeature,
  IconSizeFeature,
  IconWidthFeature,
} from './icons.feature';
import { ICON_COLOR, ICON_HEIGHT, ICON_SIZE, ICON_WIDTH, ICONS_LOADER, ICONS_PICKED } from './icons.config';
import { ColorValueHex, IconsType } from './types';
import { catchError, Observable, of } from 'rxjs';
import { HttpClient, HttpContext, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ICON_CACHE_INTERCEPTOR } from './icons-cache.interceptor';
import { toEscapedName } from './internal/toEscapedName';

export function provideBi(...features: IconFeatures[]): Provider[] {
  return features.map((it) => it.providers);
}

/**
 * @deprecated Use `provideCDNIconsLoader()` or `withIcons()` as a replacement
 */
export function provideIcons(icons: IconsType): Provider {
  return { provide: ICONS_PICKED, multi: true, useValue: icons };
}

/**
 * @deprecated Use `provideCDNIconsLoader()` or `withIcons()` as a replacement
 */
export function provideLocalIconsLoader(): Provider {
  return {
    provide: ICONS_LOADER,
    useFactory: () => {
      const pickedIcons = Object.assign({}, ...(inject(ICONS_PICKED) as unknown as object[])) as IconsType;
      return (name: string) => pickedIcons[toEscapedName(name)];
    },
  };
}

type URLFactory = () => string;

export function provideCDNIconsLoader(cdnUrlsOrFactories: URLFactory): Provider;
export function provideCDNIconsLoader(...cdnUrlsOrFactories: string[]): Provider;
export function provideCDNIconsLoader(...cdnUrlsOrFactories: (string | URLFactory)[]): Provider;
export function provideCDNIconsLoader(...cdnUrlsOrFactories: (string | URLFactory)[]): Provider {
  return {
    provide: ICONS_LOADER,
    useFactory: (): ((name: string) => Observable<string | undefined>) => {
      const httpClient = inject(HttpClient);

      let url: string;
      const first = cdnUrlsOrFactories[0];
      if (typeof first === 'string') {
        url = cdnUrlsOrFactories[Math.floor(Math.random() * cdnUrlsOrFactories.length)] as string;
      } else {
        url = first();
      }

      return (name: string): Observable<string | undefined> => {
        return httpClient
          .get<string>(`${url}/${name}.svg`, {
            headers: new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8'),
            context: new HttpContext().set(ICON_CACHE_INTERCEPTOR, true),
            // @ts-expect-error Weird angular things
            responseType: 'text',
          })
          .pipe(
            catchError((error: HttpErrorResponse) => {
              if (error.status === 404) {
                console.warn(`BiComponent: Icon "${name}" not found`);
              } else {
                console.warn(`BiComponent: Failed loading icon "${name}"`, error);
              }
              return of(undefined);
            }),
          ) as unknown as Observable<string | undefined>;
      };
    },
  };
}

export function withCDN(cdnUrlsOrFactories: URLFactory): IconCDNFeature;
export function withCDN(...cdnUrlsOrFactories: string[]): IconCDNFeature;
export function withCDN(...cdnUrlsOrFactories: (string | URLFactory)[]): IconCDNFeature {
  return {
    kind: IconFeatureKind.ICON_CDN,
    providers: [provideCDNIconsLoader(...cdnUrlsOrFactories)],
  };
}

/**
 * @deprecated Use `withCDN()` as a replacement
 */
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

export function withSize(size: string): IconSizeFeature {
  return {
    kind: IconFeatureKind.SIZE,
    providers: [{ provide: ICON_SIZE, useValue: size }],
  };
}
