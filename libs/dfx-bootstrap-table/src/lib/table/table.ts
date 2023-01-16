/**
 * @license
 * Original work Copyright Google LLC All Rights Reserved.
 * Modified work Copyright DatePoll-Systems
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  _COALESCED_STYLE_SCHEDULER,
  _CoalescedStyleScheduler,
  CDK_TABLE,
  CDK_TABLE_TEMPLATE,
  CdkTable,
  STICKY_POSITIONING_LISTENER,
} from '@angular/cdk/table';
import {ChangeDetectionStrategy, Component, Directive, HostBinding, Input, ViewEncapsulation} from '@angular/core';
import {_DisposeViewRepeaterStrategy, _RecycleViewRepeaterStrategy, _VIEW_REPEATER_STRATEGY} from '@angular/cdk/collections';

/**
 * Enables the recycle view repeater strategy, which reduces rendering latency. Not compatible with
 * tables that animate rows.
 */
@Directive({
  selector: 'ngb-table[recycleRows], table[ngb-table][recycleRows]',
  providers: [{provide: _VIEW_REPEATER_STRATEGY, useClass: _RecycleViewRepeaterStrategy}],
})
export class NgbRecycleRows {}

/**
 * Wrapper for the CdkTable with Bootstrap styles.
 */
@Component({
  selector: 'ngb-table, table[ngb-table]',
  exportAs: 'ngbTable',
  template: CDK_TABLE_TEMPLATE,
  providers: [
    {provide: _VIEW_REPEATER_STRATEGY, useClass: _DisposeViewRepeaterStrategy},
    {provide: CdkTable, useExisting: NgbTable},
    {provide: CDK_TABLE, useExisting: NgbTable},
    {provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler},
    // Prevent nested tables from seeing this table's StickyPositioningListener.
    {provide: STICKY_POSITIONING_LISTENER, useValue: null},
  ],
  encapsulation: ViewEncapsulation.None,
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
})
export class NgbTable<T> extends CdkTable<T> {
  /** Overrides the need to add position: sticky on every sticky cell element in `CdkTable`. */
  protected override needsPositionStickyOnElement = false;

  @HostBinding('class.cdk-table')
  cdkTable = true;

  @HostBinding('class.table')
  table = true;

  @HostBinding('class.table-hover')
  @Input()
  hover = false;

  @HostBinding('class.table-striped')
  @Input()
  striped = false;
}
