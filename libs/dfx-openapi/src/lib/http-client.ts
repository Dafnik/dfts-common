/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { FilterKeys, HttpMethod, MediaType, PathsWithMethod, RequiredKeysOf } from 'openapi-typescript-helpers';

import { createFinalURL } from './shared/create-final-url';
import { createQuerySerializer } from './shared/create-query-serializer';
import { HttpClientResponse } from './shared/http-client-response';
import { QuerySerializer } from './shared/query-serializer';
import { QuerySerializerOptions } from './shared/query-serializer-options';
import { removeTrailingSlash } from './shared/remove-trailing-slash';
import { RequestOptions } from './shared/request-options';

/** This type helper makes the 2nd function param required if params/requestBody are required; otherwise, optional */
type MaybeOptionalInit<Params, Location extends keyof Params> =
  RequiredKeysOf<RequestOptions<FilterKeys<Params, Location>>> extends never
    ? RequestOptions<FilterKeys<Params, Location>> | undefined
    : RequestOptions<FilterKeys<Params, Location>>;

// The final init param to accept.
// - Determines if the param is optional or not.
// - Performs arbitrary [key: string] addition.
// Note: the addition MUST happen after all the inference happens (otherwise TS can’t infer if init is required or not).
type InitParam<Init> = RequiredKeysOf<Init> extends never ? [(Init & { [key: string]: unknown })?] : [Init & { [key: string]: unknown }];

type ClientMethod<Paths extends Record<string, Record<HttpMethod, any>>, Method extends HttpMethod, Media extends MediaType> = <
  Path extends PathsWithMethod<Paths, Method>,
  Init extends MaybeOptionalInit<Paths[Path], Method>,
>(
  url: Path,
  ...init: InitParam<Init>
) => Observable<HttpClientResponse<Paths[Path][Method], Media>>;

export type ClientRequestMethod<Paths extends Record<string, Record<HttpMethod, any>>, Media extends MediaType> = <
  Method extends HttpMethod,
  Path extends PathsWithMethod<Paths, Method>,
  Init extends MaybeOptionalInit<Paths[Path], Method>,
>(
  method: Method,
  url: Path,
  ...init: InitParam<Init>
) => Observable<HttpClientResponse<Paths[Path][Method], Media>>;

export interface OpenAPIHttpClientOptions {
  baseUrl: string;
  querySerializer?: QuerySerializer<unknown> | QuerySerializerOptions;
}

export function createOpenAPIHttpClient<Paths extends Record<string, any>>(httpClient: HttpClient, options: OpenAPIHttpClientOptions) {
  return new OpenAPIHttpClient<Paths>(httpClient, options);
}

export class OpenAPIHttpClient<Paths extends Record<string, any>, Media extends MediaType = MediaType> {
  private readonly baseUrl: string;
  private readonly querySerializer?: QuerySerializer<unknown> | QuerySerializerOptions;

  constructor(
    private http: HttpClient,
    { baseUrl, querySerializer }: OpenAPIHttpClientOptions,
  ) {
    this.baseUrl = removeTrailingSlash(baseUrl);
    this.querySerializer = querySerializer;
  }

  core<Path extends PathsWithMethod<Paths, Method>, Init extends MaybeOptionalInit<Paths[Path], Method>, Method extends HttpMethod>(
    method: Method,
    path: Path,
    options: InitParam<Init>,
  ): Observable<HttpClientResponse<Paths[Path], Media>> {
    const { baseUrl: requestBaseUrl, headers, params = {}, querySerializer: requestQuerySerializer, body } = options[0] ?? {};

    const baseUrl = requestBaseUrl ? removeTrailingSlash(requestBaseUrl) : this.baseUrl;

    let querySerializer = typeof this.querySerializer === 'function' ? this.querySerializer : createQuerySerializer(this.querySerializer);

    if (requestQuerySerializer) {
      querySerializer =
        typeof requestQuerySerializer === 'function'
          ? requestQuerySerializer
          : createQuerySerializer({
              ...(typeof this.querySerializer === 'object' ? this.querySerializer : {}),
              ...requestQuerySerializer,
            });
    }

    const finalUrl = createFinalURL(path as string, {
      params,
      querySerializer,
      baseUrl,
    });

    switch (method) {
      case 'get':
        return this.http.get<HttpClientResponse<Paths[typeof path][Method], Media>>(finalUrl, { headers });
      case 'put':
        return this.http.put<HttpClientResponse<Paths[typeof path][Method], Media>>(finalUrl, body, { headers });
      case 'post':
        return this.http.post<HttpClientResponse<Paths[typeof path][Method], Media>>(finalUrl, body, { headers });
      case 'delete':
        return this.http.delete<HttpClientResponse<Paths[typeof path][Method], Media>>(finalUrl, { headers });
      case 'options':
        return this.http.options<HttpClientResponse<Paths[typeof path][Method], Media>>(finalUrl, { headers });
      case 'head':
        return this.http.head<HttpClientResponse<Paths[typeof path][Method], Media>>(finalUrl, { headers });
      case 'patch':
        return this.http.patch<HttpClientResponse<Paths[typeof path][Method], Media>>(finalUrl, body, { headers });
      default:
        throw 'Unknown method';
    }
  }

  request: ClientRequestMethod<Paths, Media> = (method, path, ...options) => {
    return this.core(method, path, options);
  };

  get: ClientMethod<Paths, 'get', Media> = (path, ...options) => {
    return this.core('get', path, options);
  };

  put: ClientMethod<Paths, 'put', Media> = (path, ...options) => {
    return this.core('put', path, options);
  };

  post: ClientMethod<Paths, 'post', Media> = (path, ...options) => {
    return this.core('post', path, options);
  };

  delete: ClientMethod<Paths, 'delete', Media> = (path, ...options) => {
    return this.core('delete', path, options);
  };

  options: ClientMethod<Paths, 'options', Media> = (path, ...options) => {
    return this.core('options', path, options);
  };

  head: ClientMethod<Paths, 'head', Media> = (path, ...options) => {
    return this.core('head', path, options);
  };

  patch: ClientMethod<Paths, 'patch', Media> = (path, ...options) => {
    return this.core('patch', path, options);
  };
}
