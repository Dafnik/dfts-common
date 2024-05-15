import { generateOptions, generateWithAccessibleOptions, generateWithImageOptions } from './types';
import { generateQrCodeCanvas, generateQrCodeCanvas$ } from './canvas';
import { generateQrCodeCanvasElement, generateQrCodeImageElement } from './htmlElements';

export function generateQrCodeImage(
  data: string | number,
  options: generateOptions & generateWithAccessibleOptions = {},
  canvas: HTMLCanvasElement = generateQrCodeCanvasElement(),
  image: HTMLImageElement = generateQrCodeImageElement(),
): { image: HTMLImageElement; dataUrl: string } {
  const dataUrl = generateQrCodeCanvas(data, options, canvas).toDataURL();
  image.setAttribute('src', dataUrl);

  image.setAttribute('alt', options.alt ?? '');
  image.setAttribute('aria-label', options.ariaLabel ?? '');
  image.setAttribute('title', options.title ?? '');

  return { image, dataUrl };
}

export async function generateQrCodeImage$(
  data: string | number,
  options: generateOptions & generateWithAccessibleOptions & generateWithImageOptions = {},
  canvas: HTMLCanvasElement = generateQrCodeCanvasElement(),
  image: HTMLImageElement = generateQrCodeImageElement(),
): Promise<{ image: HTMLImageElement; dataUrl: string }> {
  const dataUrl = (await generateQrCodeCanvas$(data, options, canvas)).toDataURL();
  image.setAttribute('src', dataUrl);

  image.setAttribute('alt', options.alt ?? '');
  image.setAttribute('aria-label', options.ariaLabel ?? '');
  image.setAttribute('title', options.title ?? '');

  return { image, dataUrl };
}
