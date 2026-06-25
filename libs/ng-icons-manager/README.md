# ng-icons-manager

**ng-icons-manager** is a CLI utility for Angular projects that automatically detects which [`@ng-icons`](https://github.com/ng-icons/ng-icons) icons you use and keeps your local icon assets in sync.

Instead of manually importing every icon or worrying about unused icons bloating your app, `ng-icons-manager` scans configured Angular templates and TypeScript files, finds the icons you actually reference, and writes only those SVGs to each job's configured output directory.

No more double importing.
No more missing icons at runtime.
No more unused icons sitting around in your project.

[![npm version](https://img.shields.io/npm/v/ng-icons-manager?label=version&color=%237469B6&cacheSeconds=86400)](https://npmjs.org/package/ng-icons-manager)
[![npm downloads per week](https://img.shields.io/npm/dw/ng-icons-manager?logo=npm&color=%237469B6)](https://npmjs.org/package/ng-icons-manager)

- [Why use ng-icons-manager?](#why-use-ng-icons-manager)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [CLI](#cli)
- [Angular icon loading](#angular-icon-loading)
- [Dynamic icon names](#dynamic-icon-names)
- [Supported packages and variants](#supported-packages-and-variants)

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

With the recommended `public/icons` output, your app loads icons from:

```text
/icons/{icon-name}.svg
```

This means your project only includes the icons you actually use.

---

## Features

- Runs independent named jobs with configurable inputs, output, include globs, and exclude globs
- Supports all package entrypoints and variants in `@ng-icons` 33.3.0
- Copies only the used icons into each job's output directory
- Supports watch mode for automatic updates during development
- Removes unused icons as your code changes
- Supports explicit icon hints for dynamic icon names

---

## Installation

Using npm:

```bash
npm install --save-dev ng-icons-manager @ng-icons/bootstrap-icons
```

Using pnpm:

```bash
pnpm add -D ng-icons-manager @ng-icons/bootstrap-icons
```

Node.js 22.18 or newer is required. Install the `@ng-icons` packages used by your project alongside the CLI. Icon packs are resolved dynamically and are intentionally not peer dependencies of `ng-icons-manager`.

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

## Configuration

A configuration file is required. Create `ng-icons-manager.config.mts` in the directory where the CLI runs:

```typescript
import { defineConfig } from 'ng-icons-manager';

export default defineConfig({
  defaults: {
    include: ['**/*.{html,ts}'],
    exclude: ['**/*.spec.ts'],
  },
  jobs: {
    app: {
      inputDirs: ['apps/app/src/app', 'libs/shared-ui/src/lib'],
      outputDir: 'apps/app/public/icons',
    },
    admin: {
      inputDirs: ['apps/admin/src/app', 'libs/shared-ui/src/lib'],
      outputDir: 'apps/admin/public/icons',
      exclude: [],
      packagePreferences: {
        mat: '@ng-icons/material-symbols',
      },
    },
  },
});
```

All paths are relative to the configuration directory. Inputs and outputs must remain inside that directory and must not traverse symbolic links. Every input directory must exist.

The CLI looks for `ng-icons-manager.config.mts` first and falls back to `ng-icons-manager.config.mjs` for existing JavaScript configs. TypeScript configs use Node's native type stripping, so keep them to erasable TypeScript syntax, use `import type` for type-only imports, and avoid runtime features that depend on `tsconfig.json`, such as path aliases.

### Configuration reference

| Property                             | Required | Default              | Description                                                      |
| ------------------------------------ | -------- | -------------------- | ---------------------------------------------------------------- |
| `jobs`                               | Yes      | —                    | Non-empty object of named scan jobs.                             |
| `defaults.include`                   | No       | `['**/*.{html,ts}']` | Global include globs applied below each input directory.         |
| `defaults.exclude`                   | No       | `[]`                 | Global exclude globs applied below each input directory.         |
| `jobs.<name>.inputDirs`              | Yes      | —                    | Non-empty list of source directories. Shared inputs are allowed. |
| `jobs.<name>.outputDir`              | Yes      | —                    | Manager-owned output directory.                                  |
| `jobs.<name>.include`                | No       | Global/default value | Replaces, rather than appends to, the global include list.       |
| `jobs.<name>.exclude`                | No       | Global/default value | Replaces, rather than appends to, the global exclude list.       |
| `jobs.<name>.packagePreferences.mat` | No       | —                    | Resolves a conflicting Material Icons/Material Symbols export.   |

Unknown configuration properties are errors. Output directories may be nested under inputs, but every configured output is automatically excluded from all scans. Output directories may not overlap one another.

### Output ownership warning

Each output directory is fully owned by `ng-icons-manager`. After a scan resolves successfully, the CLI recursively deletes that directory and recreates it.

**Do not store unrelated files, more likely you want to add output directories to your `.gitignore`.**

Before deletion, the CLI rejects filesystem roots, the configuration root, inputs, ancestors of inputs, paths outside the configuration root, symbolic-link traversal, and overlapping job outputs. Icon resolution completes before deletion, so a normal resolution failure preserves the existing output.

## CLI

Create a starter configuration:

```bash
ng-icons-manager setup
```

Use the arrow keys to select a preset, then press Enter.

List available setup presets:

```bash
ng-icons-manager setup --list-presets
```

Available setup presets:

| Preset             | Use case                                     | Output directory            | Loader path                 |
| ------------------ | -------------------------------------------- | --------------------------- | --------------------------- |
| `angular`          | Single Angular app with `public`             | `public/icons`              | `/icons/${name}.svg`        |
| `angular-monorepo` | Angular CLI workspace with `projects/app`    | `projects/app/public/icons` | `/icons/${name}.svg`        |
| `nx-monorepo`      | Nx Angular monorepo with app and shared libs | `apps/app/public/icons`     | `/icons/${name}.svg`        |
| `nx-angular`       | Single Angular app in an Nx workspace        | `public/icons`              | `/icons/${name}.svg`        |
| `angular-assets`   | Angular app using legacy `src/assets/icons`  | `src/assets/icons`          | `/assets/icons/${name}.svg` |

Setup refuses to overwrite an existing config unless you pass `--force`:

```bash
ng-icons-manager setup --force
```

Use `--preset` for non-interactive environments and `--config` to write the config somewhere else:

```bash
ng-icons-manager setup --preset nx-monorepo --config tools/ng-icons-manager.config.mts
```

After setup, read the printed asset mapping and `provideNgIconLoader` guidance. Modern `public/icons` presets should load from `/icons/${name}.svg`; the `angular-assets` preset should load from `/assets/icons/${name}.svg`.

Run every configured job once:

```bash
ng-icons-manager
```

Run selected jobs by repeating `--job`:

```bash
ng-icons-manager --job app --job admin
```

Use a configuration at another location:

```bash
ng-icons-manager --config tools/ng-icons-manager.config.mts
```

Available options:

| Option                    | Description                                                                 |
| ------------------------- | --------------------------------------------------------------------------- |
| `--config <path.mts/mjs>` | Use an explicit `.mts` or `.mjs` configuration. May be supplied once.       |
| `--job <name>`            | Run a named job. Repeatable. All jobs run when omitted.                     |
| `--watch`                 | Watch configured inputs and reload the configuration when it changes.       |
| `--verbose`               | Log config loading and successful job output.                               |
| `--ignore-missing`        | Omit unresolved icons in a one-time run. Cannot be combined with `--watch`. |

Setup options:

| Option                    | Description                                               |
| ------------------------- | --------------------------------------------------------- |
| `--preset <name>`         | Write a config from a named preset without prompting.     |
| `--list-presets`          | Print available setup presets.                            |
| `--config <path.mts/mjs>` | Write the setup config to a custom `.mts` or `.mjs` path. |
| `--force`                 | Overwrite an existing config file.                        |

Arguments and job names are validated strictly. A one-time multi-job run finishes every selected job and exits with code 1 if any job fails. Successful jobs still update independently.

### Watch mode

```bash
ng-icons-manager --watch
```

Watch mode performs a complete initial regeneration and then updates outputs incrementally. It watches configured inputs and the config file, ignores hidden paths, does not follow symbolic links, and serializes changes per job.

If a source scan contains a missing or ambiguous icon, that job's existing output remains unchanged while other jobs continue. An invalid reloaded configuration terminates the process with a nonzero exit code. Removing a job or changing its output directory does not delete the obsolete output directory.

## Angular icon loading

For an output such as `public/icons`, configure `@ng-icons/core` to request `/icons/{name}.svg`:

```typescript
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, inject } from '@angular/core';
import { provideNgIconLoader, withCaching } from '@ng-icons/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideNgIconLoader((name) => {
      const http = inject(HttpClient);
      return http.get(`/icons/${name}.svg`, { responseType: 'text' });
    }, withCaching()),
  ],
};
```

Use exact `@ng-icons` export names in templates:

```html
<ng-icon name="bootstrapAlarm" />
<ng-icon name="heroAcademicCapSolid" />
<ng-icon name="heroAcademicCapMini" />
```

Variants are resolved from their real secondary entrypoints. Output remains flat, for example `heroAcademicCapSolid.svg`.

## Dynamic icon names

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

// or
// i(bootstrapClock)
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

The `i(...)` comment acts as an explicit hint. Any icon listed inside it will be copied into the job's output directory.

---

## Supported packages and variants

| Package                          | Entrypoints/variants                                             |
| -------------------------------- | ---------------------------------------------------------------- |
| `@ng-icons/akar-icons`           | root                                                             |
| `@ng-icons/bootstrap-icons`      | root                                                             |
| `@ng-icons/boxicons`             | `regular`, `solid`, `logos`                                      |
| `@ng-icons/circum-icons`         | root                                                             |
| `@ng-icons/coolicons`            | root                                                             |
| `@ng-icons/cryptocurrency-icons` | root, `colored`                                                  |
| `@ng-icons/css.gg`               | root                                                             |
| `@ng-icons/devicon`              | `plain`, `original`, `line`                                      |
| `@ng-icons/dripicons`            | root                                                             |
| `@ng-icons/feather-icons`        | root                                                             |
| `@ng-icons/flag-icons`           | root, `square`                                                   |
| `@ng-icons/fluent-ui`            | root, `filled`                                                   |
| `@ng-icons/font-awesome`         | `regular`, `solid`, `brands`                                     |
| `@ng-icons/game-icons`           | root                                                             |
| `@ng-icons/heroicons`            | `outline`, `solid`, `mini`, `micro`                              |
| `@ng-icons/huge-icons`           | root                                                             |
| `@ng-icons/iconoir`              | `regular`, `solid`                                               |
| `@ng-icons/iconsax`              | `bold`, `bulk`, `outline`                                        |
| `@ng-icons/ionicons`             | root                                                             |
| `@ng-icons/jam-icons`            | root                                                             |
| `@ng-icons/lets-icons`           | `light`, `fill`, `duotone`, `duotone-line`, `regular`            |
| `@ng-icons/lobe-icons`           | root, `color`                                                    |
| `@ng-icons/lucide`               | root                                                             |
| `@ng-icons/material-file-icons`  | `colored`, `uncolored`                                           |
| `@ng-icons/material-icons`       | `baseline`, `outline`, `round`, `sharp`                          |
| `@ng-icons/material-symbols`     | `outline`, `round`, `sharp`                                      |
| `@ng-icons/mono-icons`           | root                                                             |
| `@ng-icons/mynaui`               | `outline`, `solid`                                               |
| `@ng-icons/octicons`             | root, `large`                                                    |
| `@ng-icons/phosphor-icons`       | `bold`, `duotone`, `fill`, `light`, `regular`, `thin`            |
| `@ng-icons/radix-icons`          | root                                                             |
| `@ng-icons/remixicon`            | root                                                             |
| `@ng-icons/simple-icons`         | root                                                             |
| `@ng-icons/solar-icons`          | `bold`, `duotone`, `outline`, `bold-duotone`, `broken`, `linear` |
| `@ng-icons/svgl`                 | root                                                             |
| `@ng-icons/tabler-icons`         | root, `fill`                                                     |
| `@ng-icons/tdesign-icons`        | root                                                             |
| `@ng-icons/typicons`             | root                                                             |
| `@ng-icons/ux-aspects`           | root                                                             |

If multiple registered entrypoints export the same name and SVG content, the export is treated as equivalent. Different SVG content is an ambiguity error. Material Icons and Material Symbols share the `mat` prefix; set `packagePreferences.mat` only when both packages provide conflicting versions of a requested icon.

By [Dafnik](https://dafnik.me)
