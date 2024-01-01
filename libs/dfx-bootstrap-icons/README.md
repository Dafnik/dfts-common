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
  - [Component parameters](#parameters)
- [Examples](#examples)
  - [Provide imported icons application wide](#provide-imported-icons-application-wide)
  - [Import all icons (not recommended)](#import-all-icons-not-recommended)

## Features

- Accessible
- Server Side Rendering (Angular Universal)
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
import { BiComponent, provideBi, withIcons, exclamationOctagonFill } from 'dfx-bootstrap-icons';

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

### On component usage

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

| **Name**        | **Type**                | **Default value** | **Description**                                   |
| --------------- | ----------------------- | ----------------- | ------------------------------------------------- |
| name            | `BiName \| BiNamesEnum` |                   | Name of the icon.                                 |
| width           | `string`                | `16`              | Width of the icon.                                |
| height          | `string`                | `16`              | Height of the icon.                               |
| color           | `#${string}`            | `correntColor`    | Color of the icon.                                |
| clearDimensions | `boolean`               | `false`           | Clears dimensions (width, height) set via config. |
| ariaLabel       | `string`                | `undefined`       | aria-label which is set on the icon.              |

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
