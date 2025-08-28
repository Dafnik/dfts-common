// openapi-resource.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Strongly-typed OpenAPI Resource builder on top of Angular's httpResource.
 *
 * - Preserves dfx-openapi type inference (paths, params, body, and typed responses)
 * - Reactive by design: pass a function that reads signals; when those signals change,
 *   the resource re-fetches.
 * - Supports per-resource httpResource options via `http` field.
 */
import { HttpClient, HttpResourceOptions, HttpResourceRef, HttpResourceRequest, httpResource } from '@angular/common/http';
import { Injector, inject } from '@angular/core';

import type { FilterKeys, HttpMethod, MediaType, PathsWithMethod, RequiredKeysOf } from 'openapi-typescript-helpers';

import { createFinalURL } from './shared/create-final-url';
import { createQuerySerializer } from './shared/create-query-serializer';
import { HttpClientResponse } from './shared/http-client-response';
import { QuerySerializer } from './shared/query-serializer';
import { QuerySerializerOptions } from './shared/query-serializer-options';
import { removeTrailingSlash } from './shared/remove-trailing-slash';
import { RequestOptions } from './shared/request-options';

export interface OpenAPIResourceOptions {
  baseUrl: string;
  querySerializer?: QuerySerializer<unknown> | QuerySerializerOptions;
}

/**
 * Allow per-resource httpResource options via `http` property, while preserving
 * OpenAPI request options shape.
 */
type WithHttpOptions<Init, TResult, TRaw> = Init & {
  http?: HttpResourceOptions<TResult, TRaw>;
};

/**
 * Make the single `init` argument optionally present based on whether params/body
 * are required for the specific operation. The init can be either a plain object
 * or a getter function (() => object | undefined) for reactivity.
 */
type InitGetterOrValue<Init> = Init | (() => Init | undefined);

type InitParam<Init> = RequiredKeysOf<Init> extends never ? [InitGetterOrValue<Init>?] : [InitGetterOrValue<Init>];

/**
 * Factory: create a typed OpenAPI Resource builder.
 * Use this once per API (e.g. per `Paths`) and reuse it throughout your app.
 */
export function createOpenAPIResource<Paths extends Record<string, any>, Media extends MediaType = MediaType>(
  options: OpenAPIResourceOptions,
  injector: Injector = inject(Injector),
) {
  return new OpenAPIResource<Paths, Media>(options, injector);
}

/**
 * OpenAPIResource returns HttpResourceRefs that refetch reactively when any
 * signals used inside your init getter (path/params/body) change.
 */
export class OpenAPIResource<Paths extends Record<string, any>, Media extends MediaType = MediaType> {
  private readonly baseUrl: string;
  private readonly querySerializer?: QuerySerializer<unknown> | QuerySerializerOptions;

  constructor(
    { baseUrl, querySerializer }: OpenAPIResourceOptions,
    private injector: Injector,
  ) {
    this.baseUrl = removeTrailingSlash(baseUrl);
    this.querySerializer = querySerializer;
  }

  /**
   * Core resource method. Prefer using the per-method helpers below.
   *
   * Example:
   * const users = api.request('get', () => '/users', () => ({
   *   params: { query: { page: pageSignal() } },
   *   http: { defaultValue: [] }
   * }));
   */
  core<Method extends HttpMethod, Path extends PathsWithMethod<Paths, Method>>(
    method: Method,
    path: () => Path | undefined,
    ...initParam: InitParam<
      WithHttpOptions<RequestOptions<FilterKeys<Paths[Path], Method>>, HttpClientResponse<Paths[Path][Method], Media>, unknown>
    >
  ): HttpResourceRef<HttpClientResponse<Paths[Path][Method], Media> | undefined> {
    type TResult = HttpClientResponse<Paths[Path][Method], Media>;
    type Raw = unknown;
    type Init = WithHttpOptions<RequestOptions<FilterKeys<Paths[Path], Method>>, TResult, Raw>;

    const initGetter: (() => Init | undefined) | undefined =
      initParam.length === 0
        ? undefined
        : typeof initParam[0] === 'function'
          ? (initParam[0] as () => Init | undefined)
          : () => initParam[0] as Init | undefined;

    // Build a reactive HttpResourceRequest
    return httpResource<TResult>(
      () => {
        const p = path();
        if (!p) {
          return undefined;
        }

        const init = initGetter?.();
        const {
          baseUrl: requestBaseUrl,
          headers,
          params = {} as NonNullable<Init['params']>,
          querySerializer: requestQuerySerializer,
          body,
        } = (init ?? {}) as Init;

        const baseUrl = requestBaseUrl ? removeTrailingSlash(requestBaseUrl) : this.baseUrl;

        let querySerializer =
          typeof this.querySerializer === 'function' ? this.querySerializer : createQuerySerializer(this.querySerializer);

        if (requestQuerySerializer) {
          querySerializer =
            typeof requestQuerySerializer === 'function'
              ? requestQuerySerializer
              : createQuerySerializer({
                  ...(typeof this.querySerializer === 'object' ? this.querySerializer : {}),
                  ...requestQuerySerializer,
                });
        }

        const finalUrl = createFinalURL(p as string, {
          params,
          querySerializer,
          baseUrl,
        });

        // Map to HttpResourceRequest for httpResource
        const request: HttpResourceRequest = {
          url: finalUrl,
          method: method.toUpperCase(),
          headers,
          body,
          // Note: query params were serialized into the URL. We do not pass
          // request.params here to avoid double-encoding.
        };

        return request;
      },
      {
        ...(initParam[0] as Init | undefined)?.http,
        injector: (initParam[0] as Init | undefined)?.http?.injector ?? this.injector,
      },
    );
  }

  // Per-method helpers (preserve OpenAPI inference)

  request<Method extends HttpMethod, Path extends PathsWithMethod<Paths, Method>>(
    method: Method,
    path: () => Path | undefined,
    ...init: InitParam<
      WithHttpOptions<RequestOptions<FilterKeys<Paths[Path], Method>>, HttpClientResponse<Paths[Path][Method], Media>, unknown>
    >
  ): HttpResourceRef<HttpClientResponse<Paths[Path][Method], Media> | undefined> {
    return this.core(method, path, ...init);
  }

  get<Path extends PathsWithMethod<Paths, 'get'>>(
    path: () => Path | undefined,
    ...init: InitParam<
      WithHttpOptions<RequestOptions<FilterKeys<Paths[Path], 'get'>>, HttpClientResponse<Paths[Path]['get'], Media>, unknown>
    >
  ): HttpResourceRef<HttpClientResponse<Paths[Path]['get'], Media> | undefined> {
    return this.core('get', path, ...init);
  }

  put<Path extends PathsWithMethod<Paths, 'put'>>(
    path: () => Path | undefined,
    ...init: InitParam<
      WithHttpOptions<RequestOptions<FilterKeys<Paths[Path], 'put'>>, HttpClientResponse<Paths[Path]['put'], Media>, unknown>
    >
  ): HttpResourceRef<HttpClientResponse<Paths[Path]['put'], Media> | undefined> {
    return this.core('put', path, ...init);
  }

  post<Path extends PathsWithMethod<Paths, 'post'>>(
    path: () => Path | undefined,
    ...init: InitParam<
      WithHttpOptions<RequestOptions<FilterKeys<Paths[Path], 'post'>>, HttpClientResponse<Paths[Path]['post'], Media>, unknown>
    >
  ): HttpResourceRef<HttpClientResponse<Paths[Path]['post'], Media> | undefined> {
    return this.core('post', path, ...init);
  }

  delete<Path extends PathsWithMethod<Paths, 'delete'>>(
    path: () => Path | undefined,
    ...init: InitParam<
      WithHttpOptions<RequestOptions<FilterKeys<Paths[Path], 'delete'>>, HttpClientResponse<Paths[Path]['delete'], Media>, unknown>
    >
  ): HttpResourceRef<HttpClientResponse<Paths[Path]['delete'], Media> | undefined> {
    return this.core('delete', path, ...init);
  }

  options<Path extends PathsWithMethod<Paths, 'options'>>(
    path: () => Path | undefined,
    ...init: InitParam<
      WithHttpOptions<RequestOptions<FilterKeys<Paths[Path], 'options'>>, HttpClientResponse<Paths[Path]['options'], Media>, unknown>
    >
  ): HttpResourceRef<HttpClientResponse<Paths[Path]['options'], Media> | undefined> {
    return this.core('options', path, ...init);
  }

  head<Path extends PathsWithMethod<Paths, 'head'>>(
    path: () => Path | undefined,
    ...init: InitParam<
      WithHttpOptions<RequestOptions<FilterKeys<Paths[Path], 'head'>>, HttpClientResponse<Paths[Path]['head'], Media>, unknown>
    >
  ): HttpResourceRef<HttpClientResponse<Paths[Path]['head'], Media> | undefined> {
    return this.core('head', path, ...init);
  }

  patch<Path extends PathsWithMethod<Paths, 'patch'>>(
    path: () => Path | undefined,
    ...init: InitParam<
      WithHttpOptions<RequestOptions<FilterKeys<Paths[Path], 'patch'>>, HttpClientResponse<Paths[Path]['patch'], Media>, unknown>
    >
  ): HttpResourceRef<HttpClientResponse<Paths[Path]['patch'], Media> | undefined> {
    return this.core('patch', path, ...init);
  }
}
