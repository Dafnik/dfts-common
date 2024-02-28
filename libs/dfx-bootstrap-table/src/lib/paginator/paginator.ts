import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  numberAttribute,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { Subscription } from 'rxjs';

import { HasInitialized, mixinInitialized } from '../core/initialized';
import { NgbPaginatorIntl } from './paginator-intl.service';

export type PageEvent = {
  pageIndex: number;
  previousPageIndex?: number;
  pageSize: number;
  length: number;
};

const DEFAULT_PAGE_SIZE = 50;

export interface NgbPaginatorDefaultOptions {
  pageSize?: number;
  pageSizeOptions?: number[];
  hidePageSize?: boolean;
  showFirstLastButtons?: boolean;
}

export const NGB_PAGINATOR_DEFAULT_OPTIONS = new InjectionToken<NgbPaginatorDefaultOptions>('NGB_PAGINATOR_DEFAULT_OPTIONS');

// Boilerplate for applying mixins to _MatPaginatorBase.
/** @docs-private */
const _NgbPaginatorMixinBase = mixinInitialized(class {});

@Component({
  selector: 'ngb-paginator',
  exportAs: 'ngbPaginator',
  templateUrl: './paginator.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: `
    .ws-nowrap {
      white-space: nowrap;
    }
  `,
})
export class NgbPaginator extends _NgbPaginatorMixinBase implements OnInit, OnDestroy, HasInitialized {
  private _initialized!: boolean;
  private _intlChanges: Subscription;

  @Input({ transform: numberAttribute })
  set pageIndex(value: number) {
    this._pageIndex = Math.max(value, 0);
    this._changeDetectorRef.markForCheck();
  }
  get pageIndex(): number {
    return this._pageIndex;
  }
  private _pageIndex = 0;

  @Input({ transform: numberAttribute })
  set length(value: number) {
    this._length = Math.max(value, 0);
    this._changeDetectorRef.markForCheck();
  }
  get length(): number {
    return this._length;
  }
  private _length = 0;

  /** Number of items to display on a page. By default, set to 10. */
  @Input({ transform: numberAttribute })
  set pageSize(value: number) {
    this._pageSize = Math.max(value, 0);
    this._updateDisplayedPageSizeOptions();
  }
  get pageSize(): number {
    return this._pageSize;
  }
  private _pageSize = 10;

  /** The set of provided page size options to display to the user. */
  @Input()
  set pageSizeOptions(value: number[] | readonly number[]) {
    this._pageSizeOptions = (value || ([] as number[])).map((p) => numberAttribute(p, 0));
    this._updateDisplayedPageSizeOptions();
  }
  get pageSizeOptions(): number[] {
    return this._pageSizeOptions;
  }
  private _pageSizeOptions: number[] = [];

  @Input({ transform: booleanAttribute }) hidePageSize = false;
  @Input({ transform: booleanAttribute }) showFirstLastButtons = false;
  @Input({ transform: booleanAttribute }) disabled = false;

  /**
   * The paginator display size.
   *
   * Bootstrap currently supports small and large sizes.
   */
  @Input() size?: 'sm' | 'lg' | null;

  @Output() readonly page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
  _displayedPageSizeOptions!: number[];

  constructor(
    public _intl: NgbPaginatorIntl,
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional() @Inject(NGB_PAGINATOR_DEFAULT_OPTIONS) defaults?: NgbPaginatorDefaultOptions,
  ) {
    super();
    this._intlChanges = _intl.changes.subscribe(() => this._changeDetectorRef.markForCheck());

    if (defaults) {
      const { pageSize, pageSizeOptions, hidePageSize, showFirstLastButtons } = defaults;

      if (pageSize != null) {
        this.pageSize = pageSize;
      }

      if (pageSizeOptions != null) {
        this.pageSizeOptions = pageSizeOptions;
      }

      if (hidePageSize != null) {
        this.hidePageSize = hidePageSize;
      }

      if (showFirstLastButtons != null) {
        this.showFirstLastButtons = showFirstLastButtons;
      }
    }
  }

  ngOnInit(): void {
    this._initialized = true;
    this._updateDisplayedPageSizeOptions();
  }

  ngOnDestroy(): void {
    this._intlChanges.unsubscribe();
  }

  nextPage(): void {
    if (!this.hasNextPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex;
    this.pageIndex = this.pageIndex + 1;
    this._emitPageEvent(previousPageIndex);
  }

  previousPage(): void {
    if (!this.hasPreviousPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex;
    this.pageIndex = this.pageIndex - 1;
    this._emitPageEvent(previousPageIndex);
  }

  firstPage(): void {
    if (!this.hasPreviousPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex;
    this.pageIndex = 0;
    this._emitPageEvent(previousPageIndex);
  }

  lastPage(): void {
    if (!this.hasNextPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex;
    this.pageIndex = this.getNumberOfPages() - 1;
    this._emitPageEvent(previousPageIndex);
  }

  hasPreviousPage(): boolean {
    return this.pageIndex >= 1 && this.pageSize !== 0;
  }

  hasNextPage(): boolean {
    const maxPageIndex = this.getNumberOfPages() - 1;
    return this.pageIndex < maxPageIndex && this.pageSize !== 0;
  }

  getNumberOfPages(): number {
    if (!this.pageSize) {
      return 0;
    }

    return Math.ceil(this.length / this.pageSize);
  }

  _changePageSize(pageSize: number): void {
    const startIndex = this.pageIndex * this.pageSize;
    const previousPageIndex = this.pageIndex;

    this.pageIndex = Math.floor(startIndex / pageSize) || 0;
    this.pageSize = pageSize;
    this._emitPageEvent(previousPageIndex);
  }

  _nextButtonsDisabled(): boolean {
    return this.disabled || !this.hasNextPage();
  }

  _previousButtonsDisabled(): boolean {
    return this.disabled || !this.hasPreviousPage();
  }

  private _updateDisplayedPageSizeOptions(): void {
    if (!this._initialized) {
      return;
    }

    if (!this.pageSize) {
      this.pageSize = this.pageSizeOptions.length !== 0 ? this.pageSizeOptions[0] : DEFAULT_PAGE_SIZE;
    }

    this._displayedPageSizeOptions = this.pageSizeOptions.slice();

    if (this._displayedPageSizeOptions.indexOf(this.pageSize) === -1) {
      this._displayedPageSizeOptions.push(this.pageSize);
    }

    this._displayedPageSizeOptions.sort((a, b) => a - b);
    this._changeDetectorRef.markForCheck();
  }

  private _emitPageEvent(previousPageIndex: number): void {
    this.page.emit({
      previousPageIndex,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: this.length,
    });
  }
}
