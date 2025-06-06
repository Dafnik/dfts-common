import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { debounceTime } from 'rxjs';

import { cl_copy } from 'dfts-helper';
import { BiComponent } from 'dfx-bootstrap-icons';
import { QRCodeComponent, QRCodeElementType, downloadQRCode } from 'dfx-qrcode';
import { ThemePicker } from 'playground-lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [
    `
      .codebox {
        background-color: var(--bs-secondary-bg);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, QRCodeComponent, ReactiveFormsModule, ThemePicker, BiComponent],
})
export class AppComponent {
  form = inject(FormBuilder).nonNullable.group({
    data: ['https://github.com/Dafnik/dfts-common', [Validators.required]],
    allowEmptyString: [true, [Validators.required]],
    elementType: ['img' as QRCodeElementType, [Validators.required]],
    errorCorrectionLevel: ['M' as const, [Validators.required]],
    stylingEnabled: [true, [Validators.required]],
    cssClass: ['qrcode', [Validators.required]],
    colorDark: ['#000000' as const, [Validators.required]],
    colorLight: ['#FFFFFF' as const, [Validators.required]],
    margin: [0, [Validators.required]],
    size: [9, [Validators.required]],
    accessibilityEnabled: [true, [Validators.required]],
    ariaLabel: ['Qr-Code Image', [Validators.required]],
    title: ['Qr-Code Image', [Validators.required]],
    alt: ['Qr-Code Image', [Validators.required]],
    imageEnabled: [true, [Validators.required]],
    imageSrc: ['/qrcode/assets/angular-logo.png', [Validators.required]],
    imageWidth: [80, [Validators.required]],
    imageHeight: [80, [Validators.required]],
  });

  public formValues = toSignal(this.form.valueChanges.pipe(debounceTime(400)), { initialValue: this.form.getRawValue() });

  previewHTML = computed(() => {
    const form = this.formValues();
    return `<qrcode [data]="'${form.data}'"
        [allowEmptyString]="${form.allowEmptyString}"
        [elementType]="'${form.elementType}'"
        [errorCorrectionLevel]="'${form.errorCorrectionLevel}'"${
          form.stylingEnabled
            ? `
        [cssClass]="'${form.cssClass}'"
        [colorDark]="'${form.colorDark}'"
        [colorLight]="'${form.colorLight}'"
        [margin]="${form.margin}"
        [size]="${form.size}"`
            : ''
        }${
          form.accessibilityEnabled
            ? `
        [ariaLabel]="'${form.ariaLabel}'"
        [title]="'${form.title}'"
        [alt]="'${form.alt}'"`
            : ''
        }${
          form.imageEnabled
            ? `
        [imageSrc]="'${form.imageSrc}'"
        [imageWidth]="${form.imageWidth}"
        [imageHeight]="${form.imageHeight}"`
            : ''
        } />`;
  });

  previewConfig = computed(() => {
    const form = this.formValues();
    return `provideQRCode(
      withAllowEmptyString(${form.allowEmptyString}),
      withElementType('${form.elementType}'),
      withErrorCorrectionLevel('${form.errorCorrectionLevel}'),${
        form.stylingEnabled
          ? `
      withCssClass('${form.cssClass}'),
      withColorDark('${form.colorDark}'),
      withColorLight('${form.colorLight}'),
      withMargin(${form.margin}),
      withSize(${form.size}),`
          : ''
      }${
        form.imageEnabled
          ? `
      withImage(
        withImageSrc('${form.imageSrc}'),
        withImageWidth(${form.imageWidth}),
        withImageHeight(${form.imageHeight})
      )`
          : ''
      }
)`;
  });

  constructor() {
    this.form.controls.accessibilityEnabled.valueChanges.pipe(takeUntilDestroyed()).subscribe((it) => {
      if (it) {
        this.form.controls.ariaLabel.enable();
        this.form.controls.title.enable();
        this.form.controls.alt.enable();
      } else {
        this.form.controls.ariaLabel.disable();
        this.form.controls.title.disable();
        this.form.controls.alt.disable();
      }
    });
    this.form.controls.imageEnabled.valueChanges.pipe(takeUntilDestroyed()).subscribe((it) => {
      if (it) {
        this.form.controls.imageSrc.enable();
        this.form.controls.imageWidth.enable();
        this.form.controls.imageHeight.enable();
      } else {
        this.form.controls.imageSrc.disable();
        this.form.controls.imageWidth.disable();
        this.form.controls.imageHeight.disable();
      }
    });

    this.form.controls.stylingEnabled.valueChanges.pipe(takeUntilDestroyed()).subscribe((it) => {
      if (it) {
        this.form.controls.cssClass.enable();
        this.form.controls.colorDark.enable();
        this.form.controls.colorLight.enable();
        this.form.controls.margin.enable();
        this.form.controls.size.enable();
      } else {
        this.form.controls.cssClass.disable();
        this.form.controls.colorDark.disable();
        this.form.controls.colorLight.disable();
        this.form.controls.margin.disable();
        this.form.controls.size.disable();
      }
    });
  }

  dataURL?: string;

  setDataURL(dataURL: string) {
    this.dataURL = dataURL;
  }

  download(): void {
    if (!this.dataURL) {
      return;
    }
    downloadQRCode(this.dataURL, this.form.controls.elementType.value === 'svg' ? 'svg' : 'png');
  }

  copy(it: string): void {
    cl_copy(it);
  }
}
