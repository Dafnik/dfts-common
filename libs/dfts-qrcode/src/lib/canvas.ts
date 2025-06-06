import { generateQrCodeCanvasElement } from './htmlElements';
import { generateQrCodeMatrix } from './matrix';
import { generateOptions, generateWithImageOptions } from './types';

export function generateQrCodeCanvas(
  data: string | number,
  options: generateOptions = {},
  canvasElement: HTMLCanvasElement = generateQrCodeCanvasElement(),
): HTMLCanvasElement {
  const matrix = generateQrCodeMatrix(data, options);
  const modSize = options.size ?? 5;
  const margin = options.margin ?? 4;
  const fgColor = options.colors?.colorLight ?? '#ffffff';
  const bgColor = options.colors?.colorDark ?? '#000000';
  const n = matrix.length;
  const size = modSize * (n + 2 * margin);

  canvasElement.width = canvasElement.height = size;
  const context = canvasElement.getContext('2d');
  if (!context) throw 'canvas support is needed for PNG output';

  context.fillStyle = fgColor;
  context.fillRect(0, 0, size, size);
  context.fillStyle = bgColor;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j]) {
        context.fillRect(modSize * (margin + j), modSize * (margin + i), modSize, modSize);
      }
    }
  }

  return canvasElement;
}

export function generateQrCodeCanvas$(
  data: string | number,
  options: generateOptions & generateWithImageOptions = {},
  canvasElement: HTMLCanvasElement = generateQrCodeCanvasElement(),
): Promise<HTMLCanvasElement> {
  canvasElement = generateQrCodeCanvas(data, options, canvasElement);
  const context = canvasElement.getContext('2d');

  if (!context) {
    throw 'QrCode: canvas support is needed for PNG and canvas output';
  }

  return new Promise((resolve) => {
    if (options.image?.src) {
      const centerImageWidth = options.image.width ?? 40;
      const centerImageHeight = options.image.height ?? 40;
      const centerImage = new Image(centerImageWidth, centerImageHeight);
      centerImage.src = options.image.src;
      centerImage.onload = () => {
        context.drawImage(
          centerImage,
          canvasElement.width / 2 - centerImageWidth / 2,
          canvasElement.height / 2 - centerImageHeight / 2,
          centerImageWidth,
          centerImageHeight,
        );
        resolve(canvasElement);
      };
      centerImage.onerror = () => resolve(canvasElement);
    } else {
      return resolve(canvasElement);
    }
  });
}
