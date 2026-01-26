# ng-icons-manager

**ng-icons-manager** is a CLI utility for Angular projects that scans your templates alongside development
for used icons from [`@ng-icons`](https://ng-icons.github.io/ng-icons) packages and copies those automatically into the `assets/icons` project folder.

No more double importing.
No worrying, "Have I imported all the icons I used?" or "Are there any unused icons bloating my project?".

[![npm version](https://img.shields.io/npm/v/ng-icons-manager?label=version&color=%237469B6&cacheSeconds=86400)](https://npmjs.org/package/ng-icons-manager)
[![npm downloads per week](https://img.shields.io/npm/dw/ng-icons-manager?logo=npm&color=%237469B6)](https://npmjs.org/package/ng-icons-manager)

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [CLI](#cli)
  - [Watch mode](#watch-mode)
  - [Verbose mode](#verbose-mode)
  - [Ignore missing icons](#ignore-missing-icons)
  - [Dynamic keys](#dynamic-keys)
- [Supported icon sets](#supported-icon-sets)
- [How it works](#how-it-works)
- [Supported packages](#supported-packages)

---

## Features

- 🚀 Automatically scans your Angular project (`src/**/*.html`, `src/**/*.ts`) for `<ng-icon name="...">`
- 📦 Copies only the **used icons** into `src/assets/icons`
- 🔁 Supports **watch mode** for incremental updates during development
- 🧹 Cleans up unused icons as you go

---

## Installation

Using npm:

```bash
npm install --save-dev ng-icons-manager
```

Using pnpm:

```bash
pnpm add -D ng-icons-manager
```

Update your `start` and `build` scripts:

```json
// package.json

{
  "scripts": {
    "build": "ng-icons-manager && ng build",
    "start": "ng-icons-manager --watch & ng serve"
  }
}
```

Configure `ng-icon` in your Angular app config to use the `assets/icons` folder:

```typescript
import { ApplicationConfig } from '@angular/core';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';

import { provideNgIconLoader, withCaching } from '@ng-icons/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideNgIconLoader((name) => {
      const http = inject(HttpClient);
      return http.get(`/assets/icons/${name}.svg`, { responseType: 'text' });
    }, withCaching()),
  ],
};
```

Make sure that you copy the assets folder:

```json
// angular.json

{
  // ...
  "options": {
    "assets": [
      {
        "glob": "**/*",
        "input": "src/assets",
        "output": "/assets"
      }
    ]
    // ...
  }
}
```

---

## Usage

### CLI

Run once to scan and copy icons:

```bash
npx ng-icons-manager
```

### Watch mode

Automatically update icons when you change code:

```bash
npx ng-icons-manager --watch
```

### Verbose mode

See logs of found/added/removed icons:

```bash
npx ng-icons-manager --verbose
```

### Ignore missing icons

Don’t fail when an icon can’t be resolved (only for non-watch mode):

```bash
npx ng-icons-manager --ignore-missing
```

### Dynamic Keys

There are times when we need to extract keys with values that may change during runtime.
One example can be when you need to use a dynamic expression:

```typescript
export const themeOptions = [
  {
    value: 'system',
    viewValue: 'System/Default',
    icon: 'bootstrapLaptop',
  },
  {
    value: 'light',
    viewValue: 'Light',
    icon: 'bootstrapSunFill',
  },
  {
    value: 'dark',
    viewValue: 'Dark',
    icon: 'bootstrapMoonStarsFill',
  },
] satisfies { value: 'system' | 'dark' | 'light'; viewValue: string; icon: string }[];
```

To support such cases, you can add a special comment to your code, which tells the CLI to extract it.
It can be added to Typescript files:

```typescript
/**
 * i(bootstrapLaptop)
 * i(bootstrapSunFill, bootstrapMoonStarsFill)
 */
export const themeOptions = [
  // ...
];

// or
/* i(bootstrapLaptop) */
```

Or to templates:

```angular2html
<!-- i(bootstrapCheckCircleFill, bootstrapCircle) -->
<!--
  i(bootstrapCheckCircleFill)
  i(bootstrapCheckCircleFill, bootstrapCheckCircleFill)
-->
<ng-icon [name]="name()" />
```

---

## Supported icon sets:

- `@ng-icons/akar-icons`
- `@ng-icons/bootstrap-icons`
- `@ng-icons/circum-icons`
- `@ng-icons/cryptocurrency-icons`
- `@ng-icons/css.gg`
- `@ng-icons/dripicons`
- `@ng-icons/feather-icons`
- `@ng-icons/game-icons`
- `@ng-icons/huge-icons`
- `@ng-icons/iconoir`
- `@ng-icons/ionicons`
- `@ng-icons/jam-icons`
- `@ng-icons/lucide`
- `@ng-icons/material-icons/baseline`
- `@ng-icons/mono-icons`
- `@ng-icons/octicons`
- `@ng-icons/radix-icons`
- `@ng-icons/remixicon`
- `@ng-icons/simple-icons`
- `@ng-icons/svgl`
- `@ng-icons/tdesign-icons`
- `@ng-icons/typicons`
- `@ng-icons/ux-aspects`

---

By [Dafnik](https://dafnik.me)
