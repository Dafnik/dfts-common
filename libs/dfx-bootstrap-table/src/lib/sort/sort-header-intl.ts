/**
 * @license
 * Original work Copyright Google LLC All Rights Reserved.
 * Modified work Copyright DatePoll-Systems
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injectable, Optional, SkipSelf} from '@angular/core';
import {Subject} from 'rxjs';

/**
 * To modify the labels and text displayed, create a new instance of MatSortHeaderIntl and
 * include it in a custom provider.
 */
@Injectable({providedIn: 'root'})
export class NgbSortHeaderIntl {
  /**
   * Stream that emits whenever the labels here are changed. Use this to notify
   * components if the labels have changed after initialization.
   */
  readonly changes: Subject<void> = new Subject<void>();
}

/** @docs-private */
export function NG_SORT_HEADER_INTL_PROVIDER_FACTORY(parentIntl: NgbSortHeaderIntl) {
  return parentIntl || new NgbSortHeaderIntl();
}

/** @docs-private */
export const NGB_SORT_HEADER_INTL_PROVIDER = {
  // If there is already an MatSortHeaderIntl available, use that. Otherwise, provide a new one.
  provide: NgbSortHeaderIntl,
  deps: [[new Optional(), new SkipSelf(), NgbSortHeaderIntl]],
  useFactory: NG_SORT_HEADER_INTL_PROVIDER_FACTORY,
};
