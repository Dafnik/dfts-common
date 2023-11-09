import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  numberAttribute,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
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
  generateWithAccessibleOptions,
  generateWithImageOptions,
} from 'dfts-qrcode';

@Component({
  selector: 'qrcode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: `<div #qrcElement [class]="cssClass"></div>`,
})
export class QRCodeComponent implements OnInit, OnChanges {
  @Input({ transform: booleanAttribute }) public allowEmptyString = inject(QRCODE_ALLOW_EMPTY_STRING);
  @Input() public colorDark = inject(QRCODE_COLOR_DARK);
  @Input() public colorLight = inject(QRCODE_COLOR_LIGHT);
  @Input() public cssClass = inject(QRCODE_CSS_CLASS);
  @Input() public elementType = inject(QRCODE_ELEMENT_TYPE);
  @Input() public errorCorrectionLevel = inject(QRCODE_ERROR_CORRECTION_LEVEL);
  @Input({ transform: numberAttribute }) public version = inject(QRCODE_VERSION);
  @Input({ transform: numberAttribute }) public size = inject(QRCODE_SIZE);
  @Input({ transform: numberAttribute }) public margin = inject(QRCODE_MARGIN);

  @Input() public imageSrc = inject(QRCODE_IMAGE_SRC);
  @Input({ transform: numberAttribute }) public imageHeight? = inject(QRCODE_IMAGE_HEIGHT);
  @Input({ transform: numberAttribute }) public imageWidth? = inject(QRCODE_IMAGE_WIDTH);

  @Input() public alt?: string;
  @Input() public ariaLabel?: string;
  @Input() public title?: string;

  @Input() public data: null | undefined | string = '';

  @Output() qrCodeDataUrl = new EventEmitter<string>();

  @ViewChild('qrcElement', { static: true }) public qrcElement!: ElementRef;

  private renderer = inject(Renderer2);

  public ngOnInit(): void {
    this.createQRCode();
  }

  public ngOnChanges(): void {
    this.createQRCode();
  }

  protected isValidQrCodeText(data: string | null | undefined): boolean {
    return data !== null && data !== undefined && data.length > 0;
  }

  private renderElement(element: Element): void {
    for (const node of this.qrcElement.nativeElement.childNodes) {
      this.renderer.removeChild(this.qrcElement.nativeElement, node);
    }
    this.renderer.appendChild(this.qrcElement.nativeElement, element);
  }

  private createQRCode(): void {
    const validQrData = this.isValidQrCodeText(this.data);
    if (!this.allowEmptyString && !validQrData) {
      console.error('[dfx-qrcode] Field `data` is empty, set \'allowEmptyString="true"\' to overwrite this behaviour.');
      return;
    } else if (this.allowEmptyString && !validQrData) {
      this.data = ' ';
    }

    try {
      const config = {
        errorCorrectionLevel: this.errorCorrectionLevel,
        version: this.version,
        size: this.size,
        alt: this.alt,
        title: this.title,
        ariaLabel: this.ariaLabel,
        margin: this.margin,
        colors: {
          colorLight: this.colorLight,
          colorDark: this.colorDark,
        },
        image: {
          src: this.imageSrc,
          width: this.imageWidth,
          height: this.imageHeight,
        },
      } as generateMatrixOptions & generateOptions & generateWithImageOptions & generateWithAccessibleOptions;

      switch (this.elementType) {
        case 'canvas': {
          generateQrCodeCanvas$(this.data!, config, this.renderer.createElement('canvas')).then((element) => {
            this.renderElement(element);
            this.qrCodeDataUrl.emit(element.toDataURL());
          });

          break;
        }

        case 'img': {
          generateQrCodeImage$(this.data!, config, this.renderer.createElement('canvas'), this.renderer.createElement('img')).then(
            ({ image, dataUrl }) => {
              this.renderElement(image);
              this.qrCodeDataUrl.emit(dataUrl);
            },
          );

          break;
        }
        default:
          console.error(`[dfx-qrcode] Error: Unknown elementType "${this.elementType}"`);
      }
    } catch (e: unknown) {
      console.error('[dfx-qrcode] Error generating QR Code:', e);
    }
  }
}
