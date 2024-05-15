# dfx-helper

Angular Library with tons of utility tools helping in all projects.

[![npm version](https://img.shields.io/npm/v/dfx-helper?label=version&color=%237469B6&cacheSeconds=86400)](https://npmjs.org/package/dfx-helper)
[![npm downloads per week](https://img.shields.io/npm/dw/dfx-helper?logo=npm&color=%237469B6)](https://npmjs.org/package/dfx-helper)
[![npm bundle size](https://img.shields.io/bundlephobia/min/dfx-helper?color=%237469B6&cacheSeconds=86400)](https://npmjs.org/package/dfx-helper)

## Version compatibility

| Angular | dfx-helper |
| ------- | ---------- |
| 17.x.x  | 7.x.x      |
| 16.x.x  | 6.1.x      |
| 15.x.x  | 6.0.x      |

## Usage

```shell
npm install dfx-helper
```

_If you have not already installed [@angular/cdk](https://material.angular.io/cdk)_

```shell
npm install @angular/cdk
```

### Useful classes:

- **Components**
  - `ABlock` - Building block from ui stuff
  - `AComponent`
  - `ADirective`
- **Decorator**/**Annotations**
  - `RunOutesideChangeDetection`
- **Directives**
  - `hideIfOnline` & `hideIfOffline`
  - `hideIfPingSucceeds` & `hideIfPingFails`
  - `print`
- **Helper**
  - `ArrayHelper`
  - `BrowserHelper`
  - `ClipboradHelper`
  - `Converter`
  - `DateHelper`
  - `Generator`
  - `Logger` / `LoggerFactory`
  - `Stopwatch`
  - `StorageHelper`
  - `StringHelper`
  - `Thread`
  - `TypeHelper`
  - `UIHelper`
- **Entities**
  - `HasID` & `HasName`
  - `IEntity` & `IEntityWithName`
- **Interceptors**
  - `BaseUrlInterceptor`
  - `LoggingInterceptor`
  - `PostPutJsonContentTypeInterceptor`
- **Pipes**
  - `cut`
  - `implode` & `implodeMapped`
  - `timespan`
  - `truncate`
- **Services**
  - `IsMobileService`
- **Strategies**
  - `AbstractTitleStrategy`
  - `DfxPreloadStrategy`

By [Dafnik](https://dafnik.me)
