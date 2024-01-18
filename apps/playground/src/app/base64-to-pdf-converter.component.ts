import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  template: `
    <div class="container container-lg d-flex w-100 h-100 p-3 mx-auto flex-column">
      <main class="px-3 pt-5">
    <h1>kellner.team Base64 to HTML Converter</h1>
    <form (ngSubmit)="submit()" [formGroup]="form" class="d-flex flex-column gap-2">
      <label for="base64Input">Enter Base64 String:</label>
      <div class="d-flex flex-column gap-2">
        <textarea id="base64Input" rows="10"  formControlName="base64"></textarea>
        <small>Or provide it via ?base64= param</small>
      </div>
      <div>
        <button type="submit">Convert to PDF</button>
      </div>
      @if (pdfViewerSrc()) {
        <div id="pdfViewer" [innerHTML]="pdfViewerSrc()"></div>
      }
    </form>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-base64-pdf-converter',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ]
})
export class Base64ToPdfConverterComponent {
  sanitizer = inject(DomSanitizer);
  base64Input = signal<undefined|string>(undefined)
  base64Param = toSignal(inject(ActivatedRoute).queryParamMap.pipe(map((it) => it.get('base64') ? this.urlSafeToBase64(it.get('base64')!) : undefined)))
  pdfViewerSrc = computed(() => {
    const base64Input = this.base64Input() ?? this.base64Param();
    if (!base64Input || base64Input === '') {
      return undefined;
    }

    const binaryData = atob(base64Input);
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: "application/pdf" });
    return this.sanitizer.bypassSecurityTrustHtml('<embed src="' + URL.createObjectURL(blob) + '" type="application/pdf" width="100%" height="1000px"/>');
  })

  form = inject(NonNullableFormBuilder).group({
    base64: ['', [Validators.required]]
  })

  urlSafeToBase64(urlSafe: string): string {
    urlSafe = urlSafe.replace(/-/g, '+').replace(/_/g, '/');
    while (urlSafe.length % 4) {
      urlSafe += '=';
    }
    return urlSafe;
  }

  submit(): void {
    this.base64Input.set(this.form.value.base64)
  }
}
