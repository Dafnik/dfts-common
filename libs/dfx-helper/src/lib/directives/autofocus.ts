import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
import {coerceNumberProperty, NumberInput} from '@angular/cdk/coercion';

@Directive({
  selector: '[focus]',
  standalone: true,
})
export class DfxAutofocus implements AfterViewInit {
  @Input() set focus(it: NumberInput) {
    this.delay = coerceNumberProperty(it);
  }

  delay = 100;

  constructor(private elRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    // Just an optional extra null check
    this.elRef.nativeElement?.focus();
  }
}
