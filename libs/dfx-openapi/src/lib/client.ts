/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FilterKeys,
  HttpMethod,
  IsOperationRequestBodyOptional,
  MediaType,
  OperationRequestBodyContent,
  PathsWithMethod,
  RequiredKeysOf,
  ResponseObjectMap,
  SuccessResponse,
} from 'openapi-typescript-helpers';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface DefaultParamsOption {
  params?: {
    query?: Record<string, unknown>;
  };
}

type ParamsOption<T> = T extends {
  parameters: any;
}
  ? RequiredKeysOf<T['parameters']> extends never
    ? { params?: T['parameters'] }
    : { params: T['parameters'] }
  : DefaultParamsOption;

type RequestBodyOption<T> =
  OperationRequestBodyContent<T> extends never
    ? { body?: never }
    : IsOperationRequestBodyOptional<T> extends true
      ? { body?: OperationRequestBodyContent<T> }
      : { body: OperationRequestBodyContent<T> };

type RequestOptions<T> = ParamsOption<T> &
  RequestBodyOption<T> & {
    baseUrl?: string;
    headers?: HttpHeaders;
    querySerializer?: QuerySerializer<unknown> | QuerySerializerOptions;
  };

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

type ClientMethod<Paths extends Record<string, Record<HttpMethod, unknown>>, Method extends HttpMethod, Media extends MediaType> = <
  Path extends PathsWithMethod<Paths, Method>,
  Init extends MaybeOptionalInit<Paths[Path], Method>,
>(
  url: Path,
  ...init: InitParam<Init>
) => Observable<HttpClientResponse<Paths[Path][Method], Media>>;

export type HttpClientResponse<T, Media extends MediaType> = SuccessResponse<ResponseObjectMap<T>, Media>;

export type QuerySerializer<T> = (
  query: T extends { parameters: any } ? NonNullable<T['parameters']['query']> : Record<string, unknown>,
) => string;

/** @see https://swagger.io/docs/specification/serialization/#query */
export type QuerySerializerOptions = {
  /** Set serialization for arrays. @see https://swagger.io/docs/specification/serialization/#query */
  array?: {
    /** default: "form" */
    style: 'form' | 'spaceDelimited' | 'pipeDelimited';
    /** default: true */
    explode: boolean;
  };
  /** Set serialization for objects. @see https://swagger.io/docs/specification/serialization/#query */
  object?: {
    /** default: "deepObject" */
    style: 'form' | 'deepObject';
    /** default: true */
    explode: boolean;
  };
  /**
   * The `allowReserved` keyword specifies whether the reserved characters
   * `:/?#[]@!$&'()*+,;=` in parameter values are allowed to be sent as they
   * are, or should be percent-encoded. By default, allowReserved is `false`,
   * and reserved characters are percent-encoded.
   * @see https://swagger.io/docs/specification/serialization/#query
   */
  allowReserved?: boolean;
};

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

/**
 * Construct URL string from baseUrl and handle path and query params
 */
function createFinalURL(
  pathname: string,
  options: {
    baseUrl: string;
    params: {
      query?: Record<string, unknown>;
      path?: Record<string, unknown>;
    };
    querySerializer: QuerySerializer<unknown>;
  },
) {
  let finalURL = `${options.baseUrl}${pathname}`;
  if (options.params?.path) {
    finalURL = defaultPathSerializer(finalURL, options.params.path);
  }
  let search = options.querySerializer(options.params.query ?? {});
  if (search.startsWith('?')) {
    search = search.substring(1);
  }
  if (search) {
    finalURL += `?${search}`;
  }
  return finalURL;
}

/**
 * Serialize primitive param values
 */
function serializePrimitiveParam(name: string, value: string, options?: { allowReserved?: boolean }): string {
  if (value === undefined || value === null) {
    return '';
  }
  if (typeof value === 'object') {
    throw new Error('Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these.');
  }
  return `${name}=${options?.allowReserved === true ? value : encodeURIComponent(value)}`;
}

/**
 * Serialize object param (shallow only)
 */
function serializeObjectParam(
  name: string,
  value: Record<string, unknown>,
  options: {
    style: 'simple' | 'label' | 'matrix' | 'form' | 'deepObject';
    explode: boolean;
    allowReserved?: boolean;
  },
): string {
  if (!value || typeof value !== 'object') {
    return '';
  }
  const values = [];
  const joiner =
    // @ts-expect-error JS syntax valid
    {
      simple: ',',
      label: '.',
      matrix: ';',
    }[options.style] || '&';

  // explode: false
  if (options.style !== 'deepObject' && !options.explode) {
    for (const k in value) {
      // @ts-expect-error Type issue
      values.push(k, options.allowReserved === true ? value[k] : encodeURIComponent(value[k]));
    }
    const final = values.join(','); // note: values are always joined by comma in explode: false (but joiner can prefix)
    switch (options.style) {
      case 'form': {
        return `${name}=${final}`;
      }
      case 'label': {
        return `.${final}`;
      }
      case 'matrix': {
        return `;${name}=${final}`;
      }
      default: {
        return final;
      }
    }
  }

  // explode: true
  for (const k in value) {
    const finalName = options.style === 'deepObject' ? `${name}[${k}]` : k;
    // @ts-expect-error Type issue
    values.push(serializePrimitiveParam(finalName, value[k], options));
  }
  const final = values.join(joiner);
  return options.style === 'label' || options.style === 'matrix' ? `${joiner}${final}` : final;
}

/**
 * Serialize array param (shallow only)
 * @type {import("./index.js").serializeArrayParam}
 */
function serializeArrayParam(
  name: string,
  value: unknown[],
  options: {
    style: 'simple' | 'label' | 'matrix' | 'form' | 'spaceDelimited' | 'pipeDelimited';
    explode: boolean;
    allowReserved?: boolean;
  },
): string {
  if (!Array.isArray(value)) {
    return '';
  }

  // explode: false
  if (!options.explode) {
    const joiner =
      // @ts-expect-error JS syntax valid
      {
        form: ',',
        spaceDelimited: '%20',
        pipeDelimited: '|',
      }[options.style] || ','; // note: for arrays, joiners vary wildly based on style + explode behavior

    // @ts-expect-error Type issue
    const final = (options.allowReserved === true ? value : value.map((v) => encodeURIComponent(v))).join(joiner);
    switch (options.style) {
      case 'simple': {
        return final;
      }
      case 'label': {
        return `.${final}`;
      }
      case 'matrix': {
        return `;${name}=${final}`;
      }
      // case "spaceDelimited":
      // case "pipeDelimited":
      default: {
        return `${name}=${final}`;
      }
    }
  }

  // explode: true
  // @ts-expect-error JS syntax valid
  const joiner = { simple: ',', label: '.', matrix: ';' }[options.style] || '&';
  const values = [];
  for (const v of value) {
    if (options.style === 'simple' || options.style === 'label') {
      // @ts-expect-error Type issue
      values.push(options.allowReserved === true ? v : encodeURIComponent(v));
    } else {
      // @ts-expect-error Type issue
      values.push(serializePrimitiveParam(name, v, options));
    }
  }
  return options.style === 'label' || options.style === 'matrix' ? `${joiner}${values.join(joiner)}` : values.join(joiner);
}

/**
 * Serialize query params to string
 */
export function createQuerySerializer<T = unknown>(options?: QuerySerializerOptions): (queryParams: T) => string {
  return function querySerializer(queryParams) {
    const search = [];
    if (queryParams && typeof queryParams === 'object') {
      for (const name in queryParams) {
        const value = queryParams[name];
        if (value === undefined || value === null) {
          continue;
        }
        if (Array.isArray(value)) {
          search.push(
            serializeArrayParam(name, value, {
              style: 'form',
              explode: true,
              ...options?.array,
              allowReserved: options?.allowReserved || false,
            }),
          );
          continue;
        }
        if (typeof value === 'object') {
          search.push(
            // @ts-expect-error Type issue
            serializeObjectParam(name, value, {
              style: 'deepObject',
              explode: true,
              ...options?.object,
              allowReserved: options?.allowReserved || false,
            }),
          );
          continue;
        }

        // @ts-expect-error Type issue
        search.push(serializePrimitiveParam(name, value, options));
      }
    }
    return search.join('&');
  };
}

const PATH_PARAM_RE = /\{[^{}]+}/g;
/**
 * Handle different OpenAPI 3.x serialization styles
 * @see https://swagger.io/docs/specification/serialization/#path
 */
function defaultPathSerializer(pathname: string, pathParams: Record<string, unknown>): string {
  let nextURL = pathname;
  for (const match of pathname.match(PATH_PARAM_RE) ?? []) {
    let name = match.substring(1, match.length - 1);
    let explode = false;
    let style: 'simple' | 'label' | 'matrix' = 'simple';
    if (name.endsWith('*')) {
      explode = true;
      name = name.substring(0, name.length - 1);
    }
    if (name.startsWith('.')) {
      style = 'label';
      name = name.substring(1);
    } else if (name.startsWith(';')) {
      style = 'matrix';
      name = name.substring(1);
    }
    if (!pathParams || pathParams[name] === undefined || pathParams[name] === null) {
      continue;
    }
    const value = pathParams[name];
    if (Array.isArray(value)) {
      nextURL = nextURL.replace(match, serializeArrayParam(name, value, { style, explode }));
      continue;
    }
    if (typeof value === 'object') {
      // @ts-expect-error Type issue
      nextURL = nextURL.replace(match, serializeObjectParam(name, value, { style, explode }));
      continue;
    }
    if (style === 'matrix') {
      // @ts-expect-error Type issue
      nextURL = nextURL.replace(match, `;${serializePrimitiveParam(name, value)}`);
      continue;
    }
    // @ts-expect-error Type issue
    nextURL = nextURL.replace(match, style === 'label' ? `.${encodeURIComponent(value)}` : encodeURIComponent(value));
  }
  return nextURL;
}

/**
 * Remove trailing slash from url
 */
function removeTrailingSlash(url: string): string {
  if (url.endsWith('/')) {
    return url.substring(0, url.length - 1);
  }
  return url;
}
