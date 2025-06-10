# dfx-qrcode

`dfx-qrcode` is a tiny and simple-to-use Angular QR-Code generator library.

[![npm version](https://img.shields.io/npm/v/dfx-qrcode?label=version&color=%237469B6&cacheSeconds=86400)](https://npmjs.org/package/dfx-qrcode)
[![npm downloads per week](https://img.shields.io/npm/dw/dfx-qrcode?logo=npm&color=%237469B6)](https://npmjs.org/package/dfx-qrcode)
[![npm bundle size](https://img.shields.io/bundlephobia/min/dfx-qrcode?color=%237469B6&cacheSeconds=86400)](https://npmjs.org/package/dfx-qrcode)

- [Demo](https://playground.dafnik.me/qrcode/)
- [Installation](#installation)
- [Version compatibility](#version-compatibility)
- [Usage](#usage)
  - [Standalone Components](#standalone-components)
  - [Module](#module)
- [Configuration](#configuration)
  - [Standalone Components](#standalone-components-1)
  - [Module](#module-1)
  - [Component parameters](#parameters)
- [Error Correction Level](#error-correction-level)
- [QR Code capacity](#qr-code-capacity)

## Features

- ES-module based
- Tiny (~10.2kB minified + gzipped)
- Accessible
- Supports Standalone Component API
- Supports Canvas, PNG, and SVG
- Works with zone-less applications

## Version compatibility

| Angular | dfx-qrcode |
| ------- | ---------- |
| 20.x.x  | 20.x.x     |
| 20.x.x  | 5.x.x      |
| 19.x.x  | 4.x.x      |
| 18.x.x  | 3.x.x      |
| 17.x.x  | 2.x.x      |
| 16.x.x  | 1.x.x      |

## Installation

- npm
  ```bash
  npm install dfx-qrcode
  ```
- pnpm
  ```bash
  pnpm install dfx-qrcode
  ```

## Usage

### Standalone Components

```typescript
import { QRCodeComponent } from 'dfx-qrcode';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <qrcode data="hello" />
  `,
  imports: [QRCodeComponent],
})
export class AppComponent {}
```

### Module

```typescript
import { QRCodeComponent } from 'dfx-qrcode';

@NgModule({
  declaration: [AppComponent],
  imports: [QRCodeComponent],
})
export class AppModule {}

@Component({
  selector: 'app-root',
  template: `
    <qrcode data="hello" />
  `,
})
export class AppComponent {}
```

## Configuration

### Standalone Components

```typescript
import {
  QRCodeComponent,
  provideQRCode,
  withAllowEmptyString,
  withColorDark,
  withColorLight,
  withElementType,
  withErrorCorrectionLevel,
  withImage,
  withImageHeight,
  withImageSrc,
  withImageWidth,
  withMargin,
  withSize,
  withVersion,
} from 'dfx-qrcode';

@Component({
  // ...
  standalone: true,
  imports: [QRCodeComponent],
  providers: [
    provideQRCode(
      withAllowEmptyString(false),
      withColorDark('#000000'),
      withColorLight('#FFFFFF'),
      withCssClass('qrcode'),
      withElementType('img'),
      withErrorCorrectionLevel('L'),
      withMargin(4),
      withImage(withImageSrc('assets/logo.png'), withImageWidth(40), withImageHeight(40)),
      withVersion(-1),
      withSize(5),
    ),
  ],
  template: `
    <qrcode data="hello" />
  `,
  // ...
})
export class AppComponent {}
```

### Module

```typescript
import {
  QRCodeComponent,
  provideQRCode,
  withAllowEmptyString,
  withColorDark,
  withColorLight,
  withElementType,
  withErrorCorrectionLevel,
  withImage,
  withImageHeight,
  withImageSrc,
  withImageWidth,
  withMargin,
  withSize,
  withVersion,
} from 'dfx-qrcode';

@NgModule({
  declaration: [AppComponent],
  imports: [QRCodeComponent],
  providers: [
    provideQRCode(
      withAllowEmptyString(false),
      withColorDark('#000000'),
      withColorLight('#FFFFFF'),
      withCssClass('qrcode'),
      withElementType('img'),
      withErrorCorrectionLevel('L'),
      withMargin(4),
      withImage(withImageSrc('assets/logo.png'), withImageWidth(40), withImageHeight(40)),
      withVersion(-1),
      withSize(5),
    ),
  ],
})
export class AppModule {}
```

### On component usage

```typescript
@Component({
  // ...
  selector: 'app-root',
  template: `
    <qrcode
      [data]="'hello'"
      [allowEmptyString]="true"
      [elementType]="'img'"
      [errorCorrectionLevel]="'L'"
      [ariaLabel]="'Description of QR-Code'"
      [title]="'Description of QR-Code'"
      [alt]="'Description of QR-Code'"
      [cssClass]="'qrcode'"
      [colorDark]="'#000000'"
      [colorLight]="'#FFFFFF'"
      [margin]="4"
      [size]="5"
      [version]="-1"
      [imageSrc]="'assets/logo.png'"
      [imageWidth]="40"
      [imageHeight]="40" />
  `,
  // ...
})
export class AppComponent {}
```

### Parameters

| **Name**             | **Type**                     | **Default value** | **Description**                                                                                 |
| -------------------- | ---------------------------- | ----------------- | ----------------------------------------------------------------------------------------------- |
| allowEmptyString     | `boolean`                    | `false`           | Define if empty or undefined strings should be converted to a space \(" "\) or throw an error\. |
| elementType          | `'img' \| 'canvas' \| 'svg'` | `img`             | Define if the QR\-Code should be rendered as HTMLImageElement or HTMLCanvasElement              |
| errorCorrectionLevel | `'L' \| 'M' \| 'Q' \| 'H'`   | `L`               | Define the error correction level                                                               |
| cssClass             | `string`                     | `qrcode`          | Define a css class for the wrapper element of the QR\-Code                                      |
| colorDark            | `Hex color`                  | `#000000`         | Define the color of the dark elements                                                           |
| colorLight           | `Hex color`                  | `#FFFFFF`         | Defined the color of the light elements                                                         |
| margin               | `number`                     | `4`               | Define the margin around the QR\-Code in px                                                     |
| size                 | `number`                     | `5`               | Define the size of the modules of the QR\-Code in px                                            |
| version              | `number`                     | `-1`              | Define the QR-Code version. `-1` means auto-select                                              |
| ariaLabel            | `string \| undefined`        | `undefined`       | String which should be set as aria\-label tag                                                   |
| title                | `string \| undefined`        | `undefined`       | String which should be set as title tag                                                         |
| alt                  | `string \| undefined`        | `undefined`       | String which should be set as alt tag                                                           |
| imageSrc             | `string \| undefined`        | `undefined`       | Path to image displayed in the QR\-Code center                                                  |
| imageHeight          | `number \| undefined`        | `undefined`       | Height of center image in px                                                                    |
| imageWidth           | `number \| undefined`        | `undefined`       | Width of center image in px                                                                     |

## Error correction level

Error correction capability allows to successfully scan a QR Code even if the symbol is dirty or damaged.
Four levels are available to choose according to the operating environment.

Higher levels offer a better error resistance but reduce the symbol's capacity.<br>
If the chances that the QR Code symbol may be corrupted are low (for example if it is showed through a monitor)
is possible to safely use a low error level such as `Low` or `Medium`.

Possible levels are shown below:

| Level            | Error resistance |
| ---------------- | :--------------: |
| **L** (Low)      |     **~7%**      |
| **M** (Medium)   |     **~15%**     |
| **Q** (Quartile) |     **~25%**     |
| **H** (High)     |     **~30%**     |

The percentage indicates the maximum amount of damaged surface after which the symbol becomes unreadable.

If not specified, the default value is `L`.

## QR Code capacity

Capacity depends on symbol version and error correction level. Also encoding modes may influence the amount of storable data.

The QR Code versions range from version **1** to version **40**.<br>
Each version has a different number of modules (black and white dots), which define the symbol's size.
For version 1 they are `21x21`, for version 2 `25x25` e so on.
Higher is the version, more are the storable data, and of course bigger will be the QR Code symbol.

The table below shows the maximum number of storable characters in each encoding mode and for each error correction level.

| Mode         | L    | M    | Q    | H    |
| ------------ | ---- | ---- | ---- | ---- |
| Numeric      | 7089 | 5596 | 3993 | 3057 |
| Alphanumeric | 4296 | 3391 | 2420 | 1852 |
| Byte         | 2953 | 2331 | 1663 | 1273 |

If no version is specified, the more suitable value will be used. Unless a specific version is required, this option is not needed.

By [Dafnik](https://dafnik.me)
