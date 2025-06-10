# dfx-openapi

[![npm version](https://img.shields.io/npm/v/dfx-openapi?label=version&color=%237469B6&cacheSeconds=86400)](https://npmjs.org/package/dfx-openapi)
[![npm downloads per week](https://img.shields.io/npm/dw/dfx-openapi?logo=npm&color=%237469B6)](https://npmjs.org/package/dfx-openapi)
[![npm bundle size](https://img.shields.io/bundlephobia/min/dfx-openapi?color=%237469B6&cacheSeconds=86400)](https://npmjs.org/package/dfx-openapi)

`dfx-openapi` is a type-safe Angular HttpClient that pulls in your OpenAPI schema.
It has virtually zero runtime and is fully compatible with Http interceptors.

The syntax is inspired by openapi-fetch.

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { createOpenAPIHttpClient } from 'dfx-openapi';

import type { paths } from './my-openapi-3-schema';

export function injectAPI() {
  const httpClient = inject(HttpClient);

  return createOpenAPIHttpClient<paths>(httpClient, { baseUrl: 'https://myapi.dev/v1/' });
}

@Injectable()
export class YourService {
  private api = injectAPI();

  // Return type (Oberservable<ItemResponse>) gets inferred
  getItem(itemId: string) {
    return this.api.get('/items/{item_id}', {
      params: {
        path: {
          item_id: '1234',
        },
      },
    });
  }

  // Return type (Oberservable<ItemResponse>) gets inferred
  updateItem(id: string, name: string) {
    return this.api.put('/items', {
      body: {
        // Body is type-safe
        id,
        name,
      },
    });
  }
}
```

`get()`, `put()`, `post()`, etc. are thin wrappers around the [Angular HttpClient](https://angular.dev/guide/http/setup#).

Notice there are no generics, and no manual typing.
Your endpoint’s request and response were inferred automatically.
This is a huge improvement in the type safety of your endpoints because every manual assertion could lead to a bug!
This eliminates all of the following:

- ✅ No typos in URLs or params
- ✅ All parameters, request bodies, and responses are type-checked and 100% match your schema
- ✅ No manual typing of your API
- ✅ Eliminates any types that hide bugs
- ✅ Also eliminates as type overrides that can also hide bugs

### Version compatibility

| Angular | dfx-openapi | openapi-typescript-helpers |
| ------- | ----------- | -------------------------- |
| 20.x.x  | 20.x.x      | \>=0.0.15                  |
| 20.x.x  | 1.x.x       | \>=0.0.15                  |
| 19.x.x  | 0.1.0       | \>=0.0.15                  |
| 18.x.x  | 0.0.3       | \>=0.0.15                  |
| 18.x.x  | 0.0.2       | 0.0.13                     |

## Setup

Install this library along with [openapi-typescript](https://openapi-ts.dev/introduction):

```shell
npm i dfx-openapi
npm i -D openapi-typescript
```

> **Highly recommended**
>
> Enable [noUncheckedIndexedAccess](https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess) in your `tsconfig.json` ([docs](https://openapi-ts.dev/advanced#enable-nouncheckedindexedaccess-in-tsconfig))

Next, generate TypeScript types from your OpenAPI schema using [openapi-typescript](https://openapi-ts.dev/):

```shell
npx openapi-typescript ./path/to/api/v1.yaml -o ./src/app/api/v1.d.ts
```

## Basic usage

The best part about using `dfx-openapi` over oldschool codegen is no documentation needed.
`dfx-openapi` encourages using your existing OpenAPI documentation rather than trying to find what function to import, or what parameters that function wants:

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { createOpenAPIHttpClient } from 'dfx-openapi';

import type { paths } from './my-openapi-3-schema';

export function injectAPI() {
  const httpClient = inject(HttpClient);

  return createOpenAPIHttpClient<paths>(httpClient, { baseUrl: 'https://myapi.dev/v1/' });
}

@Injectable()
export class YourService {
  private api = injectAPI();

  // Return type (Oberservable<ItemResponse>) gets inferred
  getItem(itemId: string) {
    return this.api.get('/items/{item_id}', {
      params: {
        path: {
          item_id: '1234',
        },
      },
    });
  }

  // Return type (Oberservable<ItemResponse>) gets inferred
  updateItem(id: string, name: string) {
    return this.api.put('/items', {
      body: {
        // Body is type-safe
        id,
        name,
      },
    });
  }
}
```

1. The HTTP method is pulled directly from `createOpenAPIHttpClient()`
2. You pass in your desired path to `get()`, `put()`, etc.
3. TypeScript takes over the rest and returns helpful errors for anything missing or invalid

## Pathname

The pathname of `get()`, `put()`, `post()`, etc. must match your schema literally.
Note in the example, the URL is `/items/{item_id}`.
This library will quickly replace all `path` params for you (so they can be typechecked).

> **TIP**
>
> dfx-openapi infers types from the URL.
> Prefer static string values over dynamic runtime values, e.g.:
>
> - ✅ `"/items/{item_id}"`
> - ❌ `[...pathParts].join("/") + "{item_id}"`

This library also supports the label and matrix serialization styles as well ([docs](https://swagger.io/docs/specification/v3_0/serialization/#path)) automatically.

## Request

The `get()` request shown needed the `params` object that groups [parameters by type](https://spec.openapis.org/oas/latest.html#parameter-object) (`path` or `query`).
If a required param is missing, or the wrong type, a type error will be thrown.

The `post()` and `put()` request required a `body` object that provided all necessary requestBody data.
