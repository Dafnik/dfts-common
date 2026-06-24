# ng-icons-manager

**ng-icons-manager** is a CLI utility for Angular projects that automatically detects which [`@ng-icons`](https://github.com/ng-icons/ng-icons) icons you use and keeps your local icon assets in sync.

Instead of manually importing every icon or worrying about unused icons bloating your app, `ng-icons-manager` scans your Angular templates and TypeScript files, finds the icons you actually reference, and copies only those SVGs into your project’s `src/assets/icons` folder.

No more double importing.
No more missing icons at runtime.
No more unused icons sitting around in your project.

[![npm version](https://img.shields.io/npm/v/ng-icons-manager?label=version&color=%237469B6&cacheSeconds=86400)](https://npmjs.org/package/ng-icons-manager)
[![npm downloads per week](https://img.shields.io/npm/dw/ng-icons-manager?logo=npm&color=%237469B6)](https://npmjs.org/package/ng-icons-manager)

- [Why use ng-icons-manager?](#why-use-ng-icons-manager)
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

> `ng-icons-manager` is not an official `@ng-icons` package. It is an independent utility built to work with `@ng-icons` packages.

---

## Why use ng-icons-manager?

When using `@ng-icons` in Angular, icon usage can easily become repetitive:

1. You use an icon in a template.
2. You also need to make sure that icon is imported, registered, or otherwise available.
3. When an icon is removed from the UI, you need to remember to clean it up too.

This works, but it creates unnecessary maintenance overhead. Over time, projects can end up with missing icons, stale imports, or unused icon definitions that are no longer needed.

`ng-icons-manager` solves this by treating your source code as the source of truth.

You write your Angular templates naturally:

```html
<ng-icon name="bootstrapSunFill" />
<ng-icon name="bootstrapMoonStarsFill" />
```

Then `ng-icons-manager` finds those icons and copies the matching SVG files into your assets folder automatically.

Your app loads icons from:

```text
/assets/icons/{icon-name}.svg
```

This means your project only includes the icons you actually use.

---

## Features

- Scans Angular projects for used icons in `src/**/*.html` and `src/**/*.ts`
- Copies only the used icons into `src/assets/icons`
- Supports watch mode for automatic updates during development
- Removes unused icons as your code changes
- Supports explicit icon hints for dynamic icon names

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
{
  "scripts": {
    "build": "ng-icons-manager && ng build",
    "start": "ng-icons-manager --watch & ng serve"
  }
}
```

The build script runs `ng-icons-manager` once before building your Angular app.

The start script runs `ng-icons-manager` in watch mode while Angular serves your project, so icons are added or removed automatically as you work.

---

## Configure Angular icon loading

Configure `ng-icon` in your Angular app config to load SVG files from the `assets/icons` folder:

```typescript
import { ApplicationConfig, inject } from '@angular/core';
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

Make sure Angular copies your assets folder during builds:

```json
{
  "options": {
    "assets": [
      {
        "glob": "**/*",
        "input": "src/assets",
        "output": "/assets"
      }
    ]
  }
}
```

---

## Usage

### CLI

Run once to scan your project and copy the detected icons:

```bash
npx ng-icons-manager
```

This is useful before a production build or whenever you want to manually refresh the icon assets.

---

### Watch mode

Automatically update icons when you change code:

```bash
npx ng-icons-manager --watch
```

Watch mode is recommended during development. When you add a new icon to a template, the matching SVG is copied into `src/assets/icons`. When you remove an icon from your code, unused icon files are cleaned up.

---

### Verbose mode

See detailed logs of found, added, and removed icons:

```bash
npx ng-icons-manager --verbose
```

This is useful for debugging or for checking which icons the CLI detected.

---

### Ignore missing icons

Don’t fail when an icon can’t be resolved:

```bash
npx ng-icons-manager --ignore-missing
```

This option is only available in non-watch mode.

It can be useful in setups where some icon names are generated dynamically or are not available at scan time.

---

### Dynamic keys

Some icons are not written directly inside a static `<ng-icon name="...">` attribute.

For example, you may store icon names in a TypeScript object and pass them dynamically:

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

Because these icon names are not always directly visible in a template, you can add a special comment to tell `ng-icons-manager` to include them.

In TypeScript files:

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

In Angular templates:

```html
<!-- i(bootstrapCheckCircleFill, bootstrapCircle) -->
<!--
  i(bootstrapCheckCircleFill)
  i(bootstrapCheckCircleFill, bootstrapCheckCircleFill)
-->
<ng-icon [name]="name()" />
```

The `i(...)` comment acts as an explicit hint. Any icon listed inside it will be copied into your assets folder.

---

## How it works

`ng-icons-manager` scans your Angular source files and looks for icon references.

It detects icons used in places like:

```html
<ng-icon name="bootstrapSunFill" />
```

and explicit icon hints like:

```typescript
/* i(bootstrapSunFill) */
```

After collecting the used icon names, it resolves them from supported `@ng-icons` packages and copies the corresponding SVG files into:

```text
src/assets/icons
```

When running in watch mode, it continues watching your files and keeps that folder synchronized as your code changes.

---

## Supported icon sets

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

## Supported packages

`ng-icons-manager` supports icons from the listed `@ng-icons` packages above.

Make sure the icon package you want to use is installed in your project. For example:

```bash
npm install @ng-icons/bootstrap-icons
```

or:

```bash
pnpm add @ng-icons/bootstrap-icons
```

---

By [Dafnik](https://dafnik.me)
