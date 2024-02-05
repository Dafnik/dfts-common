import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  input,
  numberAttribute,
  Output,
  Renderer2,
  signal,
  ViewChild,
} from '@angular/core';
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
import {
  generateMatrixOptions,
  generateOptions,
  generateQrCodeCanvas$,
  generateQrCodeImage$,
  generateQrCodeSVG$,
  generateWithAccessibleOptions,
  generateWithImageOptions,
} from 'dfts-qrcode';

@Component({
  selector: 'qrcode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: `<div #qrcElement [class]="cssClass()"></div>`,
})
export class QRCodeComponent {
  allowEmptyString = input(inject(QRCODE_ALLOW_EMPTY_STRING), { transform: booleanAttribute });
  public colorDark = input(inject(QRCODE_COLOR_DARK));
  public colorLight = input(inject(QRCODE_COLOR_LIGHT));
  public cssClass = input(inject(QRCODE_CSS_CLASS));
  public elementType = input(inject(QRCODE_ELEMENT_TYPE));
  public errorCorrectionLevel = input(inject(QRCODE_ERROR_CORRECTION_LEVEL));
  public version = input(inject(QRCODE_VERSION), { transform: numberAttribute });
  public size = input(inject(QRCODE_SIZE), { transform: numberAttribute });
  public margin = input(inject(QRCODE_MARGIN), { transform: numberAttribute });

  public imageSrc = input(inject(QRCODE_IMAGE_SRC));
  public imageHeight = input(inject(QRCODE_IMAGE_HEIGHT), { transform: numberAttribute });
  public imageWidth = input(inject(QRCODE_IMAGE_WIDTH), { transform: numberAttribute });

  public alt = input<string>();
  public ariaLabel = input<string>();
  public title = input<string>();

  public data = input<null | undefined | string>('');

  @Output() qrCodeDataUrl = new EventEmitter<string>();

  viewChild = signal<ElementRef | undefined>(undefined);

  @ViewChild('qrcElement', { static: true }) set qrcElement(it: ElementRef) {
    this.viewChild.set(it);
  }

  private renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      const viewChild = this.viewChild();

      if (!viewChild) {
        return;
      }

      let data = this.data();
      const validQrData = this.isValidQrCodeText(data);
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
            generateQrCodeCanvas$(data!, config, this.renderer.createElement('canvas')).then((element) => {
              this.renderElement(viewChild, element);
              this.qrCodeDataUrl.emit(element.toDataURL());
            });

            break;
          }

          case 'img': {
            generateQrCodeImage$(data!, config, this.renderer.createElement('canvas'), this.renderer.createElement('img')).then(
              ({ image, dataUrl }) => {
                this.renderElement(viewChild, image);
                this.qrCodeDataUrl.emit(dataUrl);
              },
            );

            break;
          }

          case 'svg': {
            generateQrCodeSVG$(data!, config).then(({ svg, dataUrl }) => {
              this.renderElement(viewChild, svg);
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

  protected isValidQrCodeText(data: string | null | undefined): boolean {
    return data !== null && data !== undefined && data.length > 0;
  }

  private renderElement(viewChild: ElementRef, element: Element): void {
    for (const node of viewChild.nativeElement.childNodes) {
      this.renderer.removeChild(viewChild.nativeElement, node);
    }
    this.renderer.appendChild(viewChild.nativeElement, element);
  }
}
