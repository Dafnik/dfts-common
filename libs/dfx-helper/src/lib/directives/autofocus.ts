import {AfterViewInit, Directive, ElementRef, Input, numberAttribute} from '@angular/core';

@Directive({
  selector: '[focus]',
  standalone: true,
})
export class DfxAutofocus implements AfterViewInit {
  @Input({transform: numberAttribute, alias: 'focus'}) delay = 100;

  constructor(private elRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    // Just an optional extra null check
    this.elRef.nativeElement?.focus();
  }
}
