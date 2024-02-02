# dfts-qrcode

`dfts-qrcode` is a tiny and simple-to-use Javascript / TypeScript QR-Code generator library.
Fully type-safe and esm module compatible.

[![npm version](https://badge.fury.io/js/dfts-qrcode.svg)](https://npmjs.org/package/dfts-qrcode)
[![NPM](https://img.shields.io/npm/dw/dfts-qrcode?logo=npm)](https://npmjs.org/package/dfts-qrcode)
[![npm bundle size](https://img.shields.io/bundlephobia/min/dfts-qrcode?cacheSeconds=86400)](https://npmjs.org/package/dfts-qrcode)

- [Installation](#installation)
- [Usage](#usage)
  - [HTMLImageElement](#htmlimageelement)
  - [HTMLCanvasElement](#htmlcanvaselement)
  - [SVG](#svg)
- [Error Correction Level](#error-correction-level)
- [QR Code capacity](#qr-code-capacity)
- [Encoding modes](#encoding-modes)

## Installation

npm:

```shell
npm install dfts-qrcode@latest
```

pnpm:

```shell
pnpm install dfts-qrcode@latest
```

## Usage

### HTMLImageElement

#### Without center image

```typescript
import { generateQrCodeImage } from 'dfts-qrcode';

const { image, dataUrl } = generateQrCodeImage('data');
```

Options:

- `generateOptions`
- `generateWithAccessibleOptions`

#### With center image

```typescript
import { generateQrCodeImage$ } from 'dfts-qrcode';

generateQrCodeImage$('data', {image: {src: './assets/logo.png'}}).then(({image, dataUrl}) => {
  ...
})
```

Options:

- `generateOptions`
- `generateWithAccessibleOptions`
- `generateWithImageOptions`

### HTMLCanvasElement

#### Without center image

```typescript
import { generateQrCodeCanvas } from 'dfts-qrcode';

const qrcode = generateQrCodeCanvas('data');
```

Options:

- `generateOptions`

#### With center image

```typescript
import { generateQrCodeCanvas$ } from 'dfts-qrcode';

generateQrCodeCanvas$('data', {image: {src: './assets/logo.png'}}).then((qrcode) => {
  ...
})
```

Options:

- `generateOptions`
- `generateWithImageOptions`

### SVG

#### Without center image

```typescript
import { generateQrCodeSVG } from 'dfts-qrcode';

const { svg, dataUrl } = generateQrCodeSVG('data');
```

Options:

- `generateOptions`
- `generateWithAccessibleOptions`

#### Without center image as string

```typescript
import { generateQrCodeSVGString } from 'dfts-qrcode';

const svgString = generateQrCodeSVGString('data');
```

Options:

- `generateOptions`
- `generateWithAccessibleOptions`

#### With center image

```typescript
import { generateQrCodeSVG$ } from 'dfts-qrcode';

generateQrCodeSVG$('data', {image: {src: './assets/logo.png'}}).then(({ svg, dataUrl }) => {
  ...
})
```

Options:

- `generateOptions`
- `generateWithAccessibleOptions`
- `generateWithImageOptions`

### QR-Code Matrix

```typescript
import { generateQrCodeMatrix } from 'dfts-qrcode';

const qrcodeMatrix = generateQrCodeMatrix('data');
```

Options:

- `generateMatrixOptions`

## Options

```typescript
import { ColorValueHex } from './types';

export type QRCodeVersion =
  | -1
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40;

export type QRCodeErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type ColorValueHex = `#${string}`;

export type generateMatrixOptions = {
  // If undefined or -1, automatically calculated
  version?: QRCodeVersion;

  // If undefined, automatically calculated
  mode?: 'numeric' | 'alphanumeric' | 'octet';

  // Defaults to L
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel;

  // If undefined or -1, automatically calculated
  mask?: number;
};

export type generateOptions = generateMatrixOptions & {
  // defaults to 5, size in px
  size?: number;

  // defaults to 4, margin in px
  margin?: number;

  colors?: {
    // defaults to '#FFFFFF', hex color
    colorLight?: ColorValueHex;

    // defaults to '#00000', hex color
    colorDark?: ColorValueHex;
  };
};

export type generateWithImageOptions = {
  image?: {
    src?: string;
    height?: number;
    width?: number;
  };
};

export type generateWithAccessibleOptions = {
  alt?: string;
  ariaLabel?: string;
  title?: string;
};
```

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

Error level can be set through `options.errorCorrectionLevel` property.<br>
If not specified, the default value is `L`.

```typescript
import { generateQrCodeMatrix } from 'dfts-qrcode';

generateQrCodeMatrix('data', { errorCorrectionLevel: 'M' });
```

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

QR Code version can be set through `options.version` property.<br>
If no version is specified, the more suitable value will be used. Unless a specific version is required, this option is not needed.

```typescript
import { generateQrCodeMatrix } from 'dfts-qrcode';

generateQrCodeMatrix('data', { errorCorrectionLevel: 'M', mode: 'octet', version: 1 });
```

## Encoding modes

Modes can be used to encode a string in a more efficient way.<br>
A mode may be more suitable than others depending on the string content.
A list of supported modes are shown in the table below:

| Mode         | Characters                                                 | Compression                               |
| ------------ | ---------------------------------------------------------- | ----------------------------------------- |
| Numeric      | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9                               | 3 characters are represented by 10 bits   |
| Alphanumeric | 0–9, A–Z (upper-case only), space, $, %, \*, +, -, ., /, : | 2 characters are represented by 11 bits   |
| Byte         | Characters from the ISO/IEC 8859-1 character set           | Each characters are represented by 8 bits |
