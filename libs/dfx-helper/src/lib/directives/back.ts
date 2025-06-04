import { Location } from '@angular/common';
import { Directive, HostListener, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { injectWindow } from '../window-provider';

@Directive({
  selector: '[back]',
  standalone: true,
})
export class DfxBackDirective {
  location = inject(Location);
  router = inject(Router);
  window = injectWindow();

  fallbackUrl = input('/');

  @HostListener('click')
  goBack(): void {
    if (this.window) {
      if (this.window.history.length > 1) {
        this.location.back();
      } else {
        this.window?.close();
      }
    } else {
      void this.router.navigateByUrl(this.fallbackUrl());
    }
  }
}
