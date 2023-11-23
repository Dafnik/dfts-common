/**
 * @license
 * Original work Copyright Google LLC All Rights Reserved.
 * Modified work Copyright DatePoll-Systems
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  booleanAttribute,
  Directive,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output
} from "@angular/core";
import { Subject } from "rxjs";
import { SortDirection } from "./sort-direction";
import { HasInitialized, mixinInitialized } from "../core/initialized";
import { CanDisable, mixinDisabled } from "../core/disabled";

/** Position of the arrow that displays when sorted. */
export type SortHeaderArrowPosition = 'before' | 'after';

/** Interface for a directive that holds sorting state consumed by `NgbSortHeader`. */
export interface NgbSortable {
  /** The id of the column being sorted. */
  id: string;

  /** Starting sort direction. */
  start: SortDirection;

  /** Whether to disable clearing the sorting state. */
  disableClear: boolean;
}

/** The current sort state. */
export interface Sort {
  /** The id of the column being sorted. */
  active: string;

  /** The sort direction. */
  direction: SortDirection;
}

/** Default options for `ngb-sort`.  */
export interface NgbSortDefaultOptions {
  /** Whether to disable clearing the sorting state. */
  disableClear?: boolean;
  /** Position of the arrow that displays when sorted. */
  arrowPosition?: SortHeaderArrowPosition;
}

/** Injection token to be used to override the default options for `ngb-sort`. */
export const NGB_SORT_DEFAULT_OPTIONS = new InjectionToken<NgbSortDefaultOptions>('MAT_SORT_DEFAULT_OPTIONS');

// Boilerplate for applying mixins to NgbSort.
/** @docs-private */
const _NgbSortBase = mixinInitialized(mixinDisabled(class {}));

/** Container for NgbSortable to manage the sort state and provide default sort parameters. */
@Directive({
  selector: '[ngb-sort]',
  exportAs: 'ngbSort',
  host: { class: 'ngb--sort' },
  inputs: ['disabled: ngbSortDisabled'],
})
export class NgbSort extends _NgbSortBase implements CanDisable, HasInitialized, OnChanges, OnDestroy, OnInit {
  /** Collection of all registered sortables that this directive manages. */
  sortables = new Map<string, NgbSortable>();

  /** Used to notify any child components listening to state changes. */
  readonly _stateChanges = new Subject<void>();

  /** The id of the most recently sorted NgbSortable. */
  @Input({alias: 'ngbSortActive'}) active = ''

  /**
   * The direction to set when an NgbSortable is initially sorted.
   * May be overriden by the NgbSortable's sort start.
   */
  @Input('ngbSortStart') start: SortDirection = 'asc';

  /** The sort direction of the currently active NgbSortable. */
  @Input('ngbSortDirection')
  private direction: SortDirection = '';

  /**
   * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
   * May be overriden by the NgbSortable's disable clear input.
   */
  @Input({alias: 'ngbSortDisableClear', transform: booleanAttribute})
  private disableClear = false;

  /** Event emitted when the user changes either the active sort or sort direction. */
  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('ngbSortChange') readonly sortChange: EventEmitter<Sort> = new EventEmitter<Sort>();

  constructor(
    @Optional()
    @Inject(NGB_SORT_DEFAULT_OPTIONS)
    private _defaultOptions?: NgbSortDefaultOptions,
  ) {
    super();
  }

  /**
   * Register function to be used by the contained NgbSortable. Adds the NgbSortable to the
   * collection of NgbSortable.
   */
  register(sortable: NgbSortable): void {
    this.sortables.set(sortable.id, sortable);
  }

  /**
   * Unregister function to be used by the contained NgbSortable. Removes the NgbSortable from the
   * collection of contained NgbSortable.
   */
  deregister(sortable: NgbSortable): void {
    this.sortables.delete(sortable.id);
  }

  /** Sets the active sort id and determines the new sort direction. */
  sort(sortable: NgbSortable): void {
    if (this.active != sortable.id) {
      this.active = sortable.id;
      this.direction = sortable.start ?? this.start;
    } else {
      this.direction = this.getNextSortDirection(sortable);
    }

    this.sortChange.emit({ active: this.active, direction: this.direction });
  }

  /** Returns the next sort direction of the active sortable, checking for potential overrides. */
  getNextSortDirection(sortable: NgbSortable): SortDirection {
    if (!sortable) {
      return '';
    }

    // Get the sort direction cycle with the potential sortable overrides.
    const disableClear = sortable?.disableClear ?? this.disableClear ?? !!this._defaultOptions?.disableClear;
    const sortDirectionCycle = getSortDirectionCycle(sortable.start || this.start, disableClear);

    // Get and return the next direction in the cycle
    let nextDirectionIndex = sortDirectionCycle.indexOf(this.direction) + 1;
    if (nextDirectionIndex >= sortDirectionCycle.length) {
      nextDirectionIndex = 0;
    }
    return sortDirectionCycle[nextDirectionIndex];
  }

  ngOnInit(): void {
    this._markInitialized();
  }

  ngOnChanges(): void {
    this._stateChanges.next();
  }

  ngOnDestroy(): void {
    this._stateChanges.complete();
  }
}

/** Returns the sort direction cycle to use given the provided parameters of order and clear. */
function getSortDirectionCycle(start: SortDirection, disableClear: boolean): SortDirection[] {
  const sortOrder: SortDirection[] = ['asc', 'desc'];
  if (start == 'desc') {
    sortOrder.reverse();
  }
  if (!disableClear) {
    sortOrder.push('');
  }

  return sortOrder;
}
