import {Directive, OnDestroy} from '@angular/core';

import {ABlock} from './abstract-block';

@Directive()
export abstract class ADirective extends ABlock implements OnDestroy {
  protected constructor() {
    super();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }
}
