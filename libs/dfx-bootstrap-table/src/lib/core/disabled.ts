/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { AbstractConstructor, Constructor } from './constructor';

/** @docs-private */
export interface CanDisable {
  /** Whether the component is disabled. */
  disabled: boolean;
}

type CanDisableCtor = Constructor<CanDisable> & AbstractConstructor<CanDisable>;

/** Mixin to augment a directive with a `disabled` property. */
export function mixinDisabled<T extends AbstractConstructor<{}>>(base: T): CanDisableCtor & T;
export function mixinDisabled<T extends Constructor<{}>>(base: T): CanDisableCtor & T {
  return class extends base {
    private _disabled = false;

    get disabled() {
      return this._disabled;
    }
    set disabled(it: boolean) {
      this._disabled = it;
    }

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
