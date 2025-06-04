import { Directive, HostListener, booleanAttribute, input } from '@angular/core';

@Directive({
  selector: '[stopPropagation]',
  standalone: true,
})
export class StopPropagationDirective {
  stopPropagation = input(true, { transform: booleanAttribute });

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.stopPropagation()) {
      event.stopPropagation();
    }
  }
}
