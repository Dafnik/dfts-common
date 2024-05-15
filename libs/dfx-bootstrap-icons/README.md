# dfx-bootstrap-icons

Straightforward, state-of-the-art Angular icon library.

Build upon the excellence of Bootstrap Icons providing you with over 2,000 icons in a bundle-size friendly way.

[![npm version](https://badge.fury.io/js/dfx-bootstrap-icons.svg)](https://npmjs.org/package/dfx-bootstrap-icons)
[![NPM](https://img.shields.io/npm/dw/dfx-bootstrap-icons?logo=npm)](https://npmjs.org/package/dfx-bootstrap-icons)
[![npm bundle size](https://img.shields.io/bundlephobia/min/dfx-bootstrap-icons?cacheSeconds=86400)](https://npmjs.org/package/dfx-bootstrap-icons)

- [Demo](https://playground.dafnik.me/bootstrap-icons/)
- [Installation](#installation)
- [Version compatibility](#version-compatibility)
- [Usage](#usage)
  - [Standalone Components](#standalone-components)
  - [Module](#module)
- [Configuration](#configuration)
  - [Standalone Components](#standalone-components-1)
  - [Module](#module-1)
  - [Configuration parameters](#configuration-parameters)
  - [Component](#component)
  - [Component parameters](#parameters)
  - [CDN](#cdn)
- [Examples](#examples)
  - [Provide imported icons application wide](#provide-imported-icons-application-wide)
  - [Import all icons (not recommended)](#import-all-icons-not-recommended)

## Features

- Server Side Rendering (Angular Universal)
- Accessible
- CDN icon loading
- Standalone Component API

## Version compatibility

| Angular | dfx-bootstrap-icons |
| ------- | ------------------- |
| 17.x.x  | 1.x.x               |

## Installation

- npm
  ```bash
  npm install dfx-bootstrap-icons
  ```
- pnpm
  ```bash
  pnpm install dfx-bootstrap-icons
  ```

## Usage

### Standalone Components

```typescript
import { BiComponent, provideBi, withIcons, exclamationOctagonFill, xCircleFill } from 'dfx-bootstrap-icons';

@Component({
  standalone: true,
  selector: 'app-root',
  template: ` <bi name="exclamation-octagon-fill" /> `,
  imports: [BiComponent],
  providers: [provideBi(withIcons({ exclamationOctagonFill }))],
})
export class AppComponent {}
```

### Module

```typescript
import { BiModule, withIcons, exclamationOctagonFill } from 'dfx-bootstrap-icons';

@NgModule({
  declaration: [AppComponent],
  imports: [BiModule.setup(withIcons({ exclamationOctagonFill }))],
})
export class AppModule {}

@Component({
  selector: 'app-root',
  template: ` <bi name="exclamation-octagon-fill" /> `,
})
export class AppComponent {}
```

## Configuration

### Standalone Components

```typescript
import { provideBi, BiComponent, withIcons, withWidth, withHeight, withColor, exclamationOctagonFill } from 'dfx-bootstrap-icons';

@Component({
  // ...
  standalone: true,
  imports: [BiComponent],
  providers: [provideBi(withIcons({ exclamationOctagonFill }), withWidth(16), withHeight(16), withColor('currentColor'))],
  template: ` <bi name="exclamation-octagon-fill" /> `,
  // ...
})
export class AppComponent {}
```

### Module

```typescript
import { BiModule, withIcons, withWidth, withHeight, withColor, exclamationOctagonFill } from 'dfx-bootstrap-icons';

@NgModule({
  declaration: [AppComponent],
  imports: [BiModule.setup(withIcons({ exclamationOctagonFill }), withWidth(16), withHeight(16), withColor('currentColor'))],
})
export class AppModule {}
```

### Configuration parameters

| **Name**   | **Type**                    | **Description**                           | **Example**                                                     |
| ---------- | --------------------------- | ----------------------------------------- | --------------------------------------------------------------- |
| withIcons  | `{ [key: string]: string }` | Icons you want to include in your bundle. | `withIcons({ exclamationOctagonFill, xCircleFill })`            |
| withCDN    | `...string[]`               | Name of the icon.                         | `withCDN('https://playground.dafnik.me/bootstrap-icons/icons')` |
| withWidth  | `string`                    | Width of the icon.                        | `withWidth('24')`                                               |
| withHeight | `string`                    | Height of the icon.                       | `withHeight('24')`                                              |
| withColor  | `string`                    | Color of the icon.                        | `withColor('#0000FF')`                                          |

### Component

```typescript
@Component({
  // ...
  selector: 'app-root',
  template: ` <bi name="exclamation-octagon-fill" width="16" height="16" color="currentColor" clearDimensions="false" ariaLabel="Icon" /> `,
  // ...
})
export class AppComponent {}
```

### Parameters

| **Name**        | **Type**                | **Description**                                   | **Default value** |
| --------------- | ----------------------- | ------------------------------------------------- | ----------------- |
| name            | `BiName \| BiNamesEnum` | Name of the icon.                                 |                   |
| width           | `string`                | Width of the icon.                                | `16`              |
| height          | `string`                | Height of the icon.                               | `16`              |
| color           | `string`                | Color of the icon.                                | `currentColor`    |
| clearDimensions | `boolean`               | Clears dimensions (width, height) set via config. | `false`           |
| ariaLabel       | `string`                | aria-label which is set on the icon.              | `undefined`       |

### CDN

You are not required to include every used icon in your bundle.
Instead, you have the option to utilize a CDN URL, allowing you to load your icons dynamically at runtime, either exclusively or in addition to bundling them.

When providing multiple URLs, dfx-bootstrap-icons is going to pick a single one randomly at app start.

Configure a pool of CDN URLs:

```typescript
import { provideBi, withCDN } from 'dfx-bootstrap-icons';

bootstrapApplication(AppComponent, {
  providers: [provideBi(withCDN('https://playground.dafnik.me/bootstrap-icons/icons', 'https://test.url.at'))],
}).catch((err) => console.error(err));
```

Don't forget to add the `HttpClient` and `biCacheInterceptor`

#### HttpClient Interceptor

When using CDNs you can use the `biCacheInterceptor` to prevent the duplicate fetching of icons.

```typescript
import { biCacheInterceptor } from 'dfx-bootstrap-icons';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

providers: [provideHttpClient(withInterceptors([biCacheInterceptor]))];
```

## Examples

### Provide imported icons application wide

```typescript
// icons.ts

import {
  apple,
  // Import more icons
} from 'dfx-bootstrap-icons';

export const ICONS = {
  apple,
  // Import more icons
};

// main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { provideBi, withIcons } from 'dfx-bootstrap-icons';
import { AppComponent } from './app/app.component';
import { ICONS } from './app/icons.ts';

bootstrapApplication(AppComponent, {
  providers: [provideBi(withIcons(ICONS))],
}).catch((err) => console.error(err));
```

### Import all icons (not recommended)

```typescript
import { provideBi, withIcons, allIcons } from 'dfx-bootstrap-icons';

bootstrapApplication(AppComponent, {
  providers: [provideBi(withIcons(allIcons))],
}).catch((err) => console.error(err));
```

By [Dafnik](https://dafnik.me)
