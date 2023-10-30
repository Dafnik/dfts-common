import { ChangeDetectionStrategy, Component, DestroyRef, inject } from "@angular/core";
import { AsyncPipe, NgIf, NgOptimizedImage } from "@angular/common";
import { downloadQRCode, QRCodeComponent, QRCodeElementType } from "dfx-qrcode";
import { ColorValueHex, QRCodeErrorCorrectionLevel } from "dfts-qrcode";
import { debounceTime, of, startWith, switchMap } from "rxjs";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  standalone: true,
  selector: 'dfx-qrcode-demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, QRCodeComponent, AsyncPipe, NgIf, ReactiveFormsModule],
})
export class AppComponent {
  form = inject(FormBuilder).nonNullable.group({
    data: ['https://github.com/Dafnik/dfts-common', [Validators.required]],
    allowEmptyString: [true, [Validators.required]],
    elementType: ['img' as QRCodeElementType, [Validators.required]],
    errorCorrectionLevel: ['M' as QRCodeErrorCorrectionLevel, [Validators.required]],
    stylingEnabled: [true, [Validators.required]],
    cssClass: ['qrcode', [Validators.required]],
    colorDark: ['#FFF' as ColorValueHex, [Validators.required]],
    colorLight: ['#263238' as ColorValueHex, [Validators.required]],
    margin: [0, [Validators.required]],
    size: [9, [Validators.required]],
    accessibilityEnabled: [true, [Validators.required]],
    ariaLabel: ['Qr-Code Image', [Validators.required]],
    title: ['Qr-Code Image', [Validators.required]],
    alt: ['Qr-Code Image', [Validators.required]],
    imageEnabled: [true, [Validators.required]],
    imageSrc: ['/assets/angular-logo.png', [Validators.required]],
    imageWidth: [80, [Validators.required]],
    imageHeight: [80, [Validators.required]],
  });

  public formValues = this.form.valueChanges.pipe(debounceTime(400), startWith(this.form.getRawValue()));

  public previewHTML$ = this.formValues.pipe(
    switchMap((form) =>
      of(
        `<qrcode [data]="'${form.data}'"
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
        } />`,
      ),
    ),
  );

  destroy = inject(DestroyRef);

  constructor() {
    this.form.controls.accessibilityEnabled.valueChanges.pipe(takeUntilDestroyed(this.destroy)).subscribe((it) => {
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
    this.form.controls.imageEnabled.valueChanges.pipe(takeUntilDestroyed(this.destroy)).subscribe((it) => {
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

    this.form.controls.stylingEnabled.valueChanges.pipe(takeUntilDestroyed(this.destroy)).subscribe((it) => {
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
    downloadQRCode(this.dataURL);
  }
}
