import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[focus]',
  standalone: true,
})
export class DfxAutofocus implements AfterViewInit {
  private elRef = inject(ElementRef<HTMLElement>);

  ngAfterViewInit(): void {
    // Just an optional extra null check
    this.elRef.nativeElement?.focus();
  }
}
