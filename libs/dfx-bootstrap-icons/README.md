# dfx-bootstrap-icons

Straightforward, state-of-the-art Angular icon library.

Build upon the excellence of Bootstrap Icons providing you with over 2,000 icons in a bundle-size friendly way.

[![npm version](https://img.shields.io/npm/v/dfx-bootstrap-icons?label=version&color=%237469B6&cacheSeconds=86400)](https://npmjs.org/package/dfx-bootstrap-icons)
[![npm downloads per week](https://img.shields.io/npm/dw/dfx-bootstrap-icons?logo=npm&color=%237469B6)](https://npmjs.org/package/dfx-bootstrap-icons)
[![npm bundle size](https://img.shields.io/bundlephobia/min/dfx-bootstrap-icons?color=%237469B6&cacheSeconds=86400)](https://npmjs.org/package/dfx-bootstrap-icons)

- [Demo](https://playground.dafnik.me/bootstrap-icons/)
- [Installation](#installation)
- [Version compatibility](#version-compatibility)
- [Usage](#usage)
  - [Setup](#usage)
  - [Standalone Components](#standalone-components)
  - [Module](#module)
- [Configuration](#configuration)
  - [Standalone Components](#standalone-components-1)
  - [Module](#module-1)
  - [Configuration parameters](#configuration-parameters)
  - [Component](#component)
  - [Component parameters](#parameters)
  - [Width, height and size](#width-height-and-size)
  - [CDN](#cdn)

## Features

- Server Side Rendering (Angular Universal)
- zone-less support
- Accessible
- CDN icon loading
- Standalone Component API

## Version compatibility

| Angular | dfx-bootstrap-icons |
| ------- | ------------------- |
| 20.x.x  | 20.x.x              |
| 20.x.x  | 4.x.x               |
| 19.x.x  | 3.x.x               |
| 18.x.x  | 2.x.x               |
| 17.x.x  | 1.x.x               |

## Installation

- npm
  ```bash
  npm install dfx-bootstrap-icons bootstrap-icons
  ```
- pnpm
  ```bash
  pnpm install dfx-bootstrap-icons bootstrap-icons
  ```

## Usage

Bundle all icons into your `assets` folder so they will be included in your bundle but not get loaded unless you actually use them.

```typescript
// main.ts
import { provideBi, withCDN } from 'dfx-bootstrap-icons';

bootstrapApplication(AppComponent, {
  providers: [provideBi(withCDN('/assets/bootstrap-icons'))],
}).catch((err) => console.error(err));
```

```json
// angular.json, project.json or nx.json

{
  "options": {
    "assets": [
      {
        "glob": "*",
        "input": "node_modules/bootstrap-icons/icons",
        "output": "/assets/bootstrap-icons"
      }
    ]
  }
}
```

#### HttpClient Interceptor

Use the `biCacheInterceptor` to prevent the duplicate fetching of icons.

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { biCacheInterceptor } from 'dfx-bootstrap-icons';

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(withInterceptors([biCacheInterceptor]))],
}).catch((err) => console.error(err));
```

Now you can use the icons via the following ways:

### Standalone Components

```typescript
import { BiComponent } from 'dfx-bootstrap-icons';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <bi name="exclamation-octagon-fill" />
  `,
  imports: [BiComponent],
})
export class AppComponent {}
```

### Module

```typescript
import { BiModule } from 'dfx-bootstrap-icons';

@NgModule({
  declaration: [AppComponent],
  imports: [BiModule],
})
export class AppModule {}

@Component({
  selector: 'app-root',
  template: `
    <bi name="exclamation-octagon-fill" />
  `,
})
export class AppComponent {}
```

## Configuration

### Standalone Components

```typescript
import { BiComponent, provideBi, withColor, withHeight, withWidth } from 'dfx-bootstrap-icons';

@Component({
  // ...
  standalone: true,
  imports: [BiComponent],
  providers: [provideBi(withWidth(16), withHeight(16), withColor('currentColor'))],
  template: `
    <bi name="exclamation-octagon-fill" />
  `,
  // ...
})
export class AppComponent {}
```

### Module

```typescript
import { BiModule, withColor, withHeight, withWidth } from 'dfx-bootstrap-icons';

@NgModule({
  declaration: [AppComponent],
  imports: [BiModule.setup(withWidth(16), withHeight(16), withColor('currentColor'))],
})
export class AppModule {}
```

### Configuration parameters

| **Name**   | **Type**                      | **Description**                                             | **Example**                                                     | **Default value** |
| ---------- | ----------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------- | ----------------- | --- |
| withCDN    | `...string[] \| () => string` | Bootstrap Icons CDN URLs.                                   | `withCDN('https://playground.dafnik.me/bootstrap-icons/icons')` |                   |     |
| withSize   | `string`                      | Size of the icon. (overrides injected `width` and `height`) | `withSize('24')`                                                | `undefined`       |
| withWidth  | `string`                      | Width of the icon.                                          | `withWidth('24')`                                               | `16`              |
| withHeight | `string`                      | Height of the icon.                                         | `withHeight('24')`                                              | `16`              |
| withColor  | `string`                      | Color of the icon.                                          | `withColor('#0000FF')`                                          | `currentColor`    |

### Component

```typescript
@Component({
  // ...
  selector: 'app-root',
  template: `
    <bi name="exclamation-octagon-fill" width="16" height="16" color="currentColor" clearDimensions="false" ariaLabel="Icon" />
  `,
  // ...
})
export class AppComponent {}
```

### Parameters

| **Name**        | **Type**  | **Description**                                                | **Default value** | **Required** |
| --------------- | --------- | -------------------------------------------------------------- | ----------------- | ------------ |
| name            | `BiName`  | Name of the icon.                                              |                   | X            |
| size            | `string`  | Size of the icon. (overrides passed `width` and `height`)      |                   |              |
| width           | `string`  | Width of the icon.                                             |                   |              |
| height          | `string`  | Height of the icon.                                            |                   |              |
| color           | `string`  | Color of the icon.                                             |                   |              |
| clearDimensions | `boolean` | Clears dimensions (width, height) set via params or injection. | `false`           |              |
| ariaLabel       | `string`  | aria-label which is set on the icon.                           |                   |              |

### Width, height and size??

`BiComponent` picks the size for the icon in the following order based on which params you inject and pass.

```typescript
const width = Input_Size ?? Input_Width ?? Injected_Size ?? Injected_Width;
const height = Input_Size ?? Input_Height ?? Injected_Size ?? Injected_Height;
```

### CDN

CDN URLs allows you to load your icons dynamically at runtime.

When providing multiple URLs, dfx-bootstrap-icons is going to pick a single one randomly at app start.

Configure a pool of CDN URLs:

```typescript
import { provideBi, withCDN } from 'dfx-bootstrap-icons';

bootstrapApplication(AppComponent, {
  providers: [provideBi(withCDN('https://playground.dafnik.me/bootstrap-icons/icons'))],
}).catch((err) => console.error(err));
```

Don't forget to add the `HttpClient` and `biCacheInterceptor`

By [Dafnik](https://dafnik.me)
