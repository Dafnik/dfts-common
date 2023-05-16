# dfx-qrcode

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test dfx-qrcode` to execute the unit tests.

| **Name**             | **Type**                   | **Default value** | **Description**                                                                                 |
| -------------------- | -------------------------- | ----------------- | ----------------------------------------------------------------------------------------------- |
| allowEmptyString     | `boolean`                  | `false`           | Define if empty or undefined strings should be converted to a space \(" "\) or throw an error\. |
| elementType          | `'img' \| 'canvas'`        | `img`             | Define if the QR\-Code should be rendered as HTMLImageElement or HTMLCanvasElement              |
| errorCorrectionLevel | `'L' \| 'M' \| 'Q' \| 'H'` | `M`               | Define the error correction level                                                               |
| cssClass             | `string`                   | `qrcode`          | Define a css class for the wrapper element of the QR\-Code                                      |
| colorDark            | `Hex color`                | `#000000`         | Define the color of the dark elements                                                           |
| colorLight           | `Hex color`                | `#FFFFFF`         | Defined the color of the light elements                                                         |
| margin               | `number`                   | `4`               | Define the margin around the QR\-Code in px                                                     |
| size                 | `number`                   | `5`               | Define the size of the modules of the QR\-Code in px                                            |
| ariaLabel            | `string \| undefined`      | `undefined`       | String which should be set as aria\-label tag                                                   |
| title                | `string \| undefined`      | `undefined`       | String which should be set as title tag                                                         |
| alt                  | `string \| undefined`      | `undefined`       | String which should be set as alt tag                                                           |
| imageSrc             | `string \| undefined`      | `undefined`       | Path to image displayed in the QR\-Code center                                                  |
| imageHeight          | `number \| undefined`      | `undefined`       | Height of center image in px                                                                    |
| imageWidth           | `number \| undefined`      | `undefined`       | Width of center image in px                                                                     |
