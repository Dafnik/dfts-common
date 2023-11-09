import { Provider } from '@angular/core';

export enum HelperFeatureKind {
  MOBILE_BREAKPOINT,
  BASE_URL_INTERCEPTOR,
  LOGGING_INTERCEPTOR_IGNORE_PATHS,
  POST_PUT_JSON_CONTENT_TYPE_INTERCEPTOR_IGNORE_PATHS,
  WINDOW,
}

export declare interface HelperFeature<KindT extends HelperFeatureKind> {
  kind: KindT;
  providers: Provider[];
}

export declare type MobileBreakpointFeature = HelperFeature<HelperFeatureKind.MOBILE_BREAKPOINT>;
export declare type WindowFeature = HelperFeature<HelperFeatureKind.WINDOW>;
export declare type BaseUrlInterceptorFeature = HelperFeature<HelperFeatureKind.BASE_URL_INTERCEPTOR>;
export declare type LoggingInterceptorFeature = HelperFeature<HelperFeatureKind.LOGGING_INTERCEPTOR_IGNORE_PATHS>;
export declare type PostPutJsonContentTypeInterceptorFeature =
  HelperFeature<HelperFeatureKind.POST_PUT_JSON_CONTENT_TYPE_INTERCEPTOR_IGNORE_PATHS>;
export declare type HelperFeatures =
  | MobileBreakpointFeature
  | BaseUrlInterceptorFeature
  | LoggingInterceptorFeature
  | PostPutJsonContentTypeInterceptorFeature
  | WindowFeature;
