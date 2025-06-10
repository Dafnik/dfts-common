/**
 * @license
 * Original work Copyright Google LLC All Rights Reserved.
 * Modified work Copyright DatePoll-Systems
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AriaDescriber, FocusMonitor } from '@angular/cdk/a11y';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import {
  ANIMATION_MODULE_TYPE,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  signal,
} from '@angular/core';

import { Subscription, merge } from 'rxjs';

import { NGB_SORT_DEFAULT_OPTIONS, NgbSort, NgbSortDefaultOptions, NgbSortable, SortHeaderArrowPosition } from './sort';
import { SortDirection } from './sort-direction';
import { getSortHeaderNotContainedWithinSortError } from './sort-errors';

/** Column definition associated with a `NgbSortHeader`. */
interface NgbSortHeaderColumnDef {
  name: string;
}

/**
 * Applies sorting behavior (click to change sort) and styles to an element, including an
 * arrow to display the current sort direction.
 *
 * Must be provided with an id and contained within a parent NgbSort directive.
 *
 * If used on header cells in a CdkTable, it will automatically default its id from its containing
 * column definition.
 */
@Component({
  selector: '[ngb-sort-header]',
  exportAs: 'ngbSortHeader',
  templateUrl: 'sort-header.html',
  styleUrls: ['sort-header.scss'],
  host: {
    class: 'ngb-sort-header',
    '(click)': '_toggleOnInteraction()',
    '(keydown)': '_handleKeydown($event)',
    '(mouseleave)': '_recentlyCleared.set(null)',
    '[attr.aria-sort]': '_getAriaSortAttribute()',
    '[class.ngb-sort-header-disabled]': '_isDisabled()',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgbSortHeader implements NgbSortable, OnDestroy, OnInit, AfterViewInit {
  _sort = inject(NgbSort, { optional: true })!;
  _columnDef = inject<NgbSortHeaderColumnDef>('NGB_SORT_HEADER_COLUMN_DEF' as any, {
    optional: true,
  });
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _focusMonitor = inject(FocusMonitor);
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _ariaDescriber = inject(AriaDescriber, { optional: true });
  private _renderChanges: Subscription | undefined;
  protected _animationModule = inject(ANIMATION_MODULE_TYPE, { optional: true });

  /**
   * Indicates which state was just cleared from the sort header.
   * Will be reset on the next interaction. Used for coordinating animations.
   */
  protected _recentlyCleared = signal<SortDirection | null>(null);

  /**
   * The element with role="button" inside this component's view. We need this
   * in order to apply a description with AriaDescriber.
   */
  private _sortButton!: HTMLElement;

  /**
   * ID of this sort header. If used within the context of a CdkColumnDef, this will default to
   * the column's name.
   */
  @Input('ngb-sort-header') id!: string;

  /** Sets the position of the arrow that displays when sorted. */
  @Input() arrowPosition: SortHeaderArrowPosition = 'after';

  /** Overrides the sort start value of the containing NgbSort for this NgbSortable. */
  @Input() start!: SortDirection;

  /** whether the sort header is disabled. */
  @Input({ transform: booleanAttribute })
  disabled = false;

  /**
   * Description applied to NgbSortHeader's button element with aria-describedby. This text should
   * describe the action that will occur when the user clicks the sort header.
   */
  @Input()
  get sortActionDescription(): string {
    return this._sortActionDescription;
  }
  set sortActionDescription(value: string) {
    this._updateSortActionDescription(value);
  }
  // Default the action description to "Sort" because it's better than nothing.
  // Without a description, the button's label comes from the sort header text content,
  // which doesn't give any indication that it performs a sorting operation.
  private _sortActionDescription = 'Sort';

  /** Overrides the disable clear value of the containing NgbSort for this NgbSortable. */
  @Input({ transform: booleanAttribute })
  disableClear!: boolean;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(...args: unknown[]);

  constructor() {
    const defaultOptions = inject<NgbSortDefaultOptions>(NGB_SORT_DEFAULT_OPTIONS, {
      optional: true,
    });

    if (!this._sort && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw getSortHeaderNotContainedWithinSortError();
    }

    if (defaultOptions?.arrowPosition) {
      this.arrowPosition = defaultOptions?.arrowPosition;
    }
  }

  ngOnInit() {
    if (!this.id && this._columnDef) {
      this.id = this._columnDef.name;
    }

    this._sort.register(this);
    this._renderChanges = merge(this._sort._stateChanges, this._sort.sortChange).subscribe(() => this._changeDetectorRef.markForCheck());
    this._sortButton = this._elementRef.nativeElement.querySelector('.ngb-sort-header-container')!;
    this._updateSortActionDescription(this._sortActionDescription);
  }

  ngAfterViewInit() {
    // We use the focus monitor because we also want to style
    // things differently based on the focus origin.
    this._focusMonitor.monitor(this._elementRef, true).subscribe(() => this._recentlyCleared.set(null));
  }

  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
    this._sort.deregister(this);
    this._renderChanges?.unsubscribe();

    if (this._sortButton) {
      this._ariaDescriber?.removeDescription(this._sortButton, this._sortActionDescription);
    }
  }

  /** Triggers the sort on this sort header and removes the indicator hint. */
  _toggleOnInteraction() {
    if (!this._isDisabled()) {
      const wasSorted = this._isSorted();
      const prevDirection = this._sort.direction;
      this._sort.sort(this);
      this._recentlyCleared.set(wasSorted && !this._isSorted() ? prevDirection : null);
    }
  }

  _handleKeydown(event: KeyboardEvent) {
    if (event.keyCode === SPACE || event.keyCode === ENTER) {
      event.preventDefault();
      this._toggleOnInteraction();
    }
  }

  /** Whether this NgbSortHeader is currently sorted in either ascending or descending order. */
  _isSorted() {
    return this._sort.active == this.id && (this._sort.direction === 'asc' || this._sort.direction === 'desc');
  }

  _isDisabled() {
    return this._sort.disabled || this.disabled;
  }

  /**
   * Gets the aria-sort attribute that should be applied to this sort header. If this header
   * is not sorted, returns null so that the attribute is removed from the host element. Aria spec
   * says that the aria-sort property should only be present on one header at a time, so removing
   * ensures this is true.
   */
  _getAriaSortAttribute() {
    if (!this._isSorted()) {
      return 'none';
    }

    return this._sort.direction == 'asc' ? 'ascending' : 'descending';
  }

  /** Whether the arrow inside the sort header should be rendered. */
  _renderArrow() {
    return !this._isDisabled() || this._isSorted();
  }

  private _updateSortActionDescription(newDescription: string) {
    // We use AriaDescriber for the sort button instead of setting an `aria-label` because some
    // screen readers (notably VoiceOver) will read both the column header *and* the button's label
    // for every *cell* in the table, creating a lot of unnecessary noise.

    // If _sortButton is undefined, the component hasn't been initialized yet so there's
    // nothing to update in the DOM.
    if (this._sortButton) {
      // removeDescription will no-op if there is no existing message.
      // TODO(jelbourn): remove optional chaining when AriaDescriber is required.
      this._ariaDescriber?.removeDescription(this._sortButton, this._sortActionDescription);
      this._ariaDescriber?.describe(this._sortButton, newDescription);
    }

    this._sortActionDescription = newDescription;
  }
}
