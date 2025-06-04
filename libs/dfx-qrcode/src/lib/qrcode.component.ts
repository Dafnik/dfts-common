import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  Renderer2,
  ViewChild,
  booleanAttribute,
  effect,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';

import {
  generateMatrixOptions,
  generateOptions,
  generateQrCodeCanvas$,
  generateQrCodeImage$,
  generateQrCodeSVG$,
  generateWithAccessibleOptions,
  generateWithImageOptions,
} from 'dfts-qrcode';

import {
  QRCODE_ALLOW_EMPTY_STRING,
  QRCODE_COLOR_DARK,
  QRCODE_COLOR_LIGHT,
  QRCODE_CSS_CLASS,
  QRCODE_ELEMENT_TYPE,
  QRCODE_ERROR_CORRECTION_LEVEL,
  QRCODE_IMAGE_HEIGHT,
  QRCODE_IMAGE_SRC,
  QRCODE_IMAGE_WIDTH,
  QRCODE_MARGIN,
  QRCODE_SIZE,
  QRCODE_VERSION,
} from './qrcode.config';

@Component({
  selector: 'qrcode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: `
    <div #qrcElement [class]="cssClass()"></div>
  `,
})
export class QRCodeComponent {
  allowEmptyString = input(inject(QRCODE_ALLOW_EMPTY_STRING), { transform: booleanAttribute });
  colorDark = input(inject(QRCODE_COLOR_DARK));
  colorLight = input(inject(QRCODE_COLOR_LIGHT));
  cssClass = input(inject(QRCODE_CSS_CLASS));
  elementType = input(inject(QRCODE_ELEMENT_TYPE));
  errorCorrectionLevel = input(inject(QRCODE_ERROR_CORRECTION_LEVEL));
  version = input(inject(QRCODE_VERSION), { transform: numberAttribute });
  size = input(inject(QRCODE_SIZE), { transform: numberAttribute });
  margin = input(inject(QRCODE_MARGIN), { transform: numberAttribute });

  imageSrc = input(inject(QRCODE_IMAGE_SRC));
  imageHeight = input(inject(QRCODE_IMAGE_HEIGHT), { transform: numberAttribute });
  imageWidth = input(inject(QRCODE_IMAGE_WIDTH), { transform: numberAttribute });

  alt = input<string>();
  ariaLabel = input<string>();
  title = input<string>();

  data = input<null | undefined | string>('');

  @Output() qrCodeDataUrl = new EventEmitter<string>();

  #viewChild = signal<ElementRef | undefined>(undefined);

  @ViewChild('qrcElement', { static: true }) set qrcElement(it: ElementRef) {
    this.#viewChild.set(it);
  }

  #renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      const viewChild = this.#viewChild();

      if (!viewChild) {
        return;
      }

      let data = this.data();
      const validQrData = this.#isValidQrCodeText(data);
      if (!this.allowEmptyString() && !validQrData) {
        console.error('[dfx-qrcode] Field `data` is empty, set \'allowEmptyString="true"\' to overwrite this behaviour.');
        return;
      } else if (this.allowEmptyString() && !validQrData) {
        data = ' ';
      }

      try {
        const config = {
          errorCorrectionLevel: this.errorCorrectionLevel(),
          version: this.version(),
          size: this.size(),
          alt: this.alt(),
          title: this.title(),
          ariaLabel: this.ariaLabel(),
          margin: this.margin(),
          colors: {
            colorLight: this.colorLight(),
            colorDark: this.colorDark(),
          },
          image: {
            src: this.imageSrc(),
            width: this.imageWidth(),
            height: this.imageHeight(),
          },
        } as generateMatrixOptions & generateOptions & generateWithImageOptions & generateWithAccessibleOptions;

        switch (this.elementType()) {
          case 'canvas': {
            generateQrCodeCanvas$(data!, config, this.#renderer.createElement('canvas')).then((element) => {
              this.#renderElement(viewChild, element);
              this.qrCodeDataUrl.emit(element.toDataURL());
            });

            break;
          }

          case 'img': {
            generateQrCodeImage$(data!, config, this.#renderer.createElement('canvas'), this.#renderer.createElement('img')).then(
              ({ image, dataUrl }) => {
                this.#renderElement(viewChild, image);
                this.qrCodeDataUrl.emit(dataUrl);
              },
            );

            break;
          }

          case 'svg': {
            generateQrCodeSVG$(data!, config).then(({ svg, dataUrl }) => {
              this.#renderElement(viewChild, svg);
              this.qrCodeDataUrl.emit(dataUrl);
            });

            break;
          }
          default:
            console.error(`[dfx-qrcode] Error: Unknown elementType "${this.elementType()}"`);
        }
      } catch (e: unknown) {
        console.error('[dfx-qrcode] Error generating QR Code:', e);
      }
    });
  }

  #isValidQrCodeText(data: string | null | undefined): boolean {
    return data !== null && data !== undefined && data.length > 0;
  }

  #renderElement(viewChild: ElementRef, element: Element): void {
    for (const node of viewChild.nativeElement.childNodes) {
      this.#renderer.removeChild(viewChild.nativeElement, node);
    }
    this.#renderer.appendChild(viewChild.nativeElement, element);
  }
}
