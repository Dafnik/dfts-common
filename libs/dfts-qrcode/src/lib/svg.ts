import { generateQrCodeMatrix } from './matrix';
import { generateOptions, generateWithAccessibleOptions, generateWithImageOptions } from './types';

const parser = new DOMParser();

export function generateQrCodeSVGString(data: string | number, options: generateOptions & generateWithAccessibleOptions = {}): string {
  const matrix = generateQrCodeMatrix(data, options);
  const modSize = options.size ?? 5;
  const margin = options.margin ?? 4;
  const fgColor = options.colors?.colorLight ?? '#ffffff';
  const bgColor = options.colors?.colorDark ?? '#000000';
  const n = matrix.length;
  const size = modSize * (n + 2 * margin);

  const xml = [
    '<svg xmlns="http://www.w3.org/2000/svg"',
    `width="${size}" height="${size}" ${options.alt ? `alt="${options.alt}"` : ''} ${options.ariaLabel ? `aria-label="${options.ariaLabel}"` : ''} ${options.title ? `title="${options.title}"` : ''}>`,
  ];
  xml.push(`<rect width="${size}" height="${size}" fill="${fgColor}" />`);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j]) {
        xml.push(
          `<rect x="${modSize * (margin + j)}" y="${modSize * (margin + i)}" width="${modSize + 0.3}" height="${modSize + 0.3}" fill="${bgColor}" />`,
        );
      }
    }
  }

  xml.push('</svg>');

  return xml.join('\n');
}

export function generateQrCodeSVG(
  data: string | number,
  options: generateOptions & generateWithAccessibleOptions = {},
): { svg: HTMLElement; dataUrl: string } {
  const svg = generateQrCodeSVGString(data, options);
  const base64Svg = btoa(svg);
  return { svg: parser.parseFromString(svg, 'image/svg+xml').documentElement, dataUrl: `data:image/svg+xml;base64,${base64Svg}` };
}

export function generateQrCodeSVG$(
  data: string | number,
  options: generateOptions & generateWithAccessibleOptions & generateWithImageOptions = {},
): Promise<{ svg: HTMLElement; dataUrl: string }> {
  const { svg, dataUrl } = generateQrCodeSVG(data, options);

  return new Promise((resolve) => {
    if (options.image && options.image.src) {
      const centerImageWidth = options.image.width ?? 40;
      const centerImageHeight = options.image.height ?? 40;
      const centerImage = new Image(centerImageWidth, centerImageHeight);
      centerImage.src = options.image.src;
      centerImage.onload = () => {
        const svgWidth = svg.getAttribute('width') ?? '-100';
        const svgHeight = svg.getAttribute('height') ?? '-100';

        // Calculate the position to center the image within the SVG
        const x = (parseInt(svgWidth) - centerImage.width) / 2;
        const y = (parseInt(svgHeight) - centerImage.height) / 2;

        const imageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        imageElement.setAttributeNS(null, 'x', x.toString());
        imageElement.setAttributeNS(null, 'y', y.toString());
        imageElement.setAttributeNS(null, 'width', centerImage.width.toString());
        imageElement.setAttributeNS(null, 'height', centerImage.height.toString());

        // @ts-expect-error Dumb typescript does not even understand the if
        imageElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', options.image.src);

        svg.appendChild(imageElement);

        resolve({ svg, dataUrl: `data:image/svg+xml;base64,${btoa(new XMLSerializer().serializeToString(svg))}` });
      };
      centerImage.onerror = () => resolve({ svg, dataUrl });
    } else {
      return resolve({ svg, dataUrl });
    }
  });
}
