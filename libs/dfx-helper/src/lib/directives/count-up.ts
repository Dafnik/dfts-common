import { booleanAttribute, Directive, ElementRef, HostListener, inject, Input, numberAttribute } from '@angular/core';
import { s_from } from 'dfts-helper';
import { injectWindow } from '../window-provider';

@Directive({
  selector: '[countUp]',
  standalone: true,
})
export class DfxCountUp {
  el = inject(ElementRef<HTMLElement>);

  window = injectWindow();

  @Input({ transform: numberAttribute, required: true }) set countUp(it: number) {
    if (it) {
      this.count = it;
      this.animateCountUp();
    }
  }

  count = 0;

  /**
   * How long you want the animation to take.
   * @param time time in ms; defaults to <code>4000</code>
   */
  @Input({ transform: numberAttribute }) animationDuration = 4000;

  @Input({ transform: booleanAttribute }) clickable = true;

  counterRunning = false;

  // Calculate how long each ‘frame’ should last if we want to update the animation 60 times per second 1000/60
  frameDuration = 16.6;

  @HostListener('mousedown') onMouseDown(): void {
    if (this.clickable) {
      this.animateCountUp();
    }
  }

  // An ease-out function that slows the count as it progresses
  easeOutQuad = (t: number): number => t * (2 - t);

  // The animation function, which takes an Element
  animateCountUp = (): void => {
    // exit early if the counter is already running
    if (this.counterRunning || !this.window) {
      return;
    }

    if (this.count === 0) {
      this.el.nativeElement.innerText = '0';
      return;
    }

    this.counterRunning = true;

    // Use that to calculate how many frames we need to complete the animation
    const totalFrames = Math.round(this.animationDuration / this.frameDuration);

    let frame = 0;
    const countTo = this.count;
    // Start the animation running 60 times per second
    const animate = () => {
      frame++;
      // Calculate our progress as a value between 0 and 1
      // Pass that value to our easing function to get our
      // progress on a curve
      const progress = this.easeOutQuad(frame / totalFrames);
      // Use the progress value to calculate the current count
      const currentCount = Math.round(countTo * progress);

      // If the current count has changed, update the element
      if (parseInt(this.el.nativeElement.innerText, 10) !== currentCount) {
        this.el.nativeElement.innerText = s_from(currentCount);
      }

      // If we’ve reached our last frame, stop the animation
      if (frame === totalFrames) {
        this.counterRunning = false;
      } else {
        // otherwise, continue the animation by calling animate again
        this.window?.requestIdleCallback(animate);
      }
    };

    this.window.requestIdleCallback(animate);
  };
}
