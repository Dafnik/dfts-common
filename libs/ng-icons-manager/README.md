# ng-icons-manager

**ng-icons-manager** is a CLI utility for Angular projects that automatically scans your templates for used icons from  
[`@ng-icons`](https://ng-icons.github.io/) packages and copies only those into your `src/assets/icons` folder.  
This ensures **bundle-size friendliness**, **incremental updates**, and an easy developer experience.

[![npm version](https://img.shields.io/npm/v/ng-icons-manager?label=version&color=%237469B6&cacheSeconds=86400)](https://npmjs.org/package/ng-icons-manager)  
[![npm downloads per week](https://img.shields.io/npm/dw/ng-icons-manager?logo=npm&color=%237469B6)](https://npmjs.org/package/ng-icons-manager)  
[![npm bundle size](https://img.shields.io/bundlephobia/min/ng-icons-manager?color=%237469B6&cacheSeconds=86400)](https://npmjs.org/package/ng-icons-manager)

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [CLI](#cli)
  - [Watch mode](#watch-mode)
  - [Verbose mode](#verbose-mode)
  - [Ignore missing icons](#ignore-missing-icons)
- [How it works](#how-it-works)
- [Supported packages](#supported-packages)
- [Schematic Setup](#schematic-setup)

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

### Schematic Setup

To automatically configure your Angular project with everything `ng-icons-manager` needs, use the included schematic:

```bash
ng g ng-icons-manager:setup
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

Don’t fail when an icon can’t be resolved:

```bash
npx ng-icons-manager --ignore-missing
```

---

## How it works

1. Scans project files for `<ng-icon name="...">` usage
2. Resolves the right `@ng-icons/*` package based on the prefix
3. Copies the SVG into `src/assets/icons`
4. In watch mode: runs incrementally, adds new, deletes unused

---

By [Dafnik](https://dafnik.me)
