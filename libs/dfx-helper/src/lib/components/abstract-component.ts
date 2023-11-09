import { Component, OnDestroy } from '@angular/core';
import { ABlock } from './abstract-block';

@Component({
  template: '',
})
export abstract class AComponent extends ABlock implements OnDestroy {
  protected constructor() {
    super();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }
}
