import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';

import { mixinInitialized } from '../core/initialized';
import { mixinDisabled } from '../core/disabled';

/**
 * A context for the
 * * `NgbPaginatorFirst`
 * * `NgbPaginatorPrevious`
 * * `NgbPaginatorNext`
 * * `NgbPaginatorLast`
 * * `NgbPaginatorEllipsis`
 * * `NgbPaginatorPages`
 *
 * link templates in case you want to override one.
 *
 * @since 4.1.0
 */
export interface NgbPaginatorLinkContext {
  /**
   * Page number displayed by the current link.
   */
  currentPage: number;

  /**
   * If `true`, the current link is disabled.
   */
  disabled: boolean;
}

/**
 * A context for the `NgbPaginatorNumber` link template in case you want to override one.
 *
 * Extends `NgbPaginatorLinkContext`.
 *
 * @since 4.1.0
 */
export interface NgbPaginatorNumberContext extends NgbPaginatorLinkContext {
  /**
   * The page number, displayed by the current page link.
   */
  $implicit: number;
}

/**
 * A context for the `NgbPaginatorPages` pages template in case you want to override
 * the way all pages are displayed.
 *
 * @since 9.1.0
 */
export interface NgbPaginatorPagesContext {
  /**
   * The currently selected page number.
   */
  $implicit: number;

  /**
   * If `true`, pagination is disabled.
   */
  disabled: boolean;

  /**
   * Pages numbers that should be rendered starting with 1.
   */
  pages: number[];
}

/**
 * A directive to match the 'ellipsis' link template
 *
 * @since 4.1.0
 */
@Directive({ selector: 'ng-template[ngbPaginatorEllipsis]' })
export class NgbPaginatorEllipsis {
  constructor(public templateRef: TemplateRef<NgbPaginatorLinkContext>) {}
}

/**
 * A directive to match the 'first' link template
 *
 * @since 4.1.0
 */
@Directive({ selector: 'ng-template[ngbPaginatorFirst]' })
export class NgbPaginatorFirst {
  constructor(public templateRef: TemplateRef<NgbPaginatorLinkContext>) {}
}

/**
 * A directive to match the 'last' link template
 *
 * @since 4.1.0
 */
@Directive({ selector: 'ng-template[ngbPaginatorLast]' })
export class NgbPaginatorLast {
  constructor(public templateRef: TemplateRef<NgbPaginatorLinkContext>) {}
}

/**
 * A directive to match the 'next' link template
 *
 * @since 4.1.0
 */
@Directive({ selector: 'ng-template[ngbPaginatorNext]' })
export class NgbPaginatorNext {
  constructor(public templateRef: TemplateRef<NgbPaginatorLinkContext>) {}
}

/**
 * A directive to match the page 'number' link template
 *
 * @since 4.1.0
 */
@Directive({ selector: 'ng-template[ngbPaginatorNumber]' })
export class NgbPaginatorNumber {
  constructor(public templateRef: TemplateRef<NgbPaginatorNumberContext>) {}
}

/**
 * A directive to match the 'previous' link template
 *
 * @since 4.1.0
 */
@Directive({ selector: 'ng-template[ngbPaginatorPrevious]' })
export class NgbPaginatorPrevious {
  constructor(public templateRef: TemplateRef<NgbPaginatorLinkContext>) {}
}

/**
 * A directive to match the 'pages' whole content
 *
 * @since 9.1.0
 */
@Directive({ selector: 'ng-template[ngbPaginatorPages]' })
export class NgbPaginatorPages {
  constructor(public templateRef: TemplateRef<NgbPaginatorPagesContext>) {}
}

// Boilerplate for applying mixins to MatSort.
/** @docs-private */
const _NgbPaginatorBase = mixinDisabled(mixinInitialized(class {}));

/**
 * A component that displays page numbers and allows to customize them in several ways.
 */
@Component({
  selector: 'ngb-paginator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'navigation' },
  template: `
    <ng-template #first><span aria-hidden="true" i18n="@@ngb.pagination.first">&laquo;&laquo;</span></ng-template>
    <ng-template #previous><span aria-hidden="true" i18n="@@ngb.pagination.previous">&laquo;</span></ng-template>
    <ng-template #next><span aria-hidden="true" i18n="@@ngb.pagination.next">&raquo;</span></ng-template>
    <ng-template #last><span aria-hidden="true" i18n="@@ngb.pagination.last">&raquo;&raquo;</span></ng-template>
    <ng-template #ellipsis>...</ng-template>
    <ng-template #defaultNumber let-page let-currentPage="currentPage">
      {{ page }}
      <span *ngIf="page === currentPage" class="visually-hidden">(current)</span>
    </ng-template>
    <ng-template #defaultPages let-page let-pages="pages" let-disabled="disabled">
      <li
        *ngFor="let pageNumber of pages"
        class="page-item"
        [class.active]="pageNumber === page"
        [class.disabled]="isEllipsis(pageNumber) || disabled"
        [attr.aria-current]="pageNumber === page ? 'page' : null"
      >
        <a *ngIf="isEllipsis(pageNumber)" class="page-link" tabindex="-1" aria-disabled="true">
          <ng-template
            [ngTemplateOutlet]="tplEllipsis?.templateRef || ellipsis"
            [ngTemplateOutletContext]="{ disabled: true, currentPage: page }"
          ></ng-template>
        </a>
        <a
          *ngIf="!isEllipsis(pageNumber)"
          class="page-link"
          href
          (click)="selectPage(pageNumber); $event.preventDefault()"
          [attr.tabindex]="disabled ? '-1' : null"
          [attr.aria-disabled]="disabled ? 'true' : null"
        >
          <ng-template
            [ngTemplateOutlet]="tplNumber?.templateRef || defaultNumber"
            [ngTemplateOutletContext]="{ disabled: disabled, $implicit: pageNumber, currentPage: page }"
          ></ng-template>
        </a>
      </li>
    </ng-template>

    <div class="row justify-content-end d-block d-md-none">
      <div class="mt-2 col-sm-12">
        <select class="form-select" id="selectPageSize" name="pageSize" [(ngModel)]="pageSize" (ngModelChange)="selectPageSize()">
          <option [ngValue]="_pageSize" *ngFor="let _pageSize of this.pageSizes">{{ _pageSize }}</option>
        </select>
      </div>
    </div>

    <div class="d-flex justify-content-end">
      <div class="mt-2 col-md-4 col-lg-3 col-xl-1 d-none d-md-block">
        <select class="form-select" id="selectPageSize" name="pageSize" [(ngModel)]="pageSize" (ngModelChange)="selectPageSize()">
          <option [ngValue]="_pageSize" *ngFor="let _pageSize of this.pageSizes">{{ _pageSize }}</option>
        </select>
      </div>

      <ul class="mt-2 ms-2" [class]="'pagination' + (size ? ' pagination-' + size : '')">
        <li *ngIf="boundaryLinks" class="page-item" [class.disabled]="previousDisabled()">
          <a
            aria-label="First"
            i18n-aria-label="@@ngb.pagination.first-aria"
            class="page-link"
            href
            (click)="selectPage(1); $event.preventDefault()"
            [attr.tabindex]="previousDisabled() ? '-1' : null"
            [attr.aria-disabled]="previousDisabled() ? 'true' : null"
          >
            <ng-template
              [ngTemplateOutlet]="tplFirst?.templateRef || first"
              [ngTemplateOutletContext]="{ disabled: previousDisabled(), currentPage: page }"
            ></ng-template>
          </a>
        </li>

        <li *ngIf="directionLinks" class="page-item" [class.disabled]="previousDisabled()">
          <a
            aria-label="Previous"
            i18n-aria-label="@@ngb.pagination.previous-aria"
            class="page-link"
            href
            (click)="selectPage(page - 1); $event.preventDefault()"
            [attr.tabindex]="previousDisabled() ? '-1' : null"
            [attr.aria-disabled]="previousDisabled() ? 'true' : null"
          >
            <ng-template
              [ngTemplateOutlet]="tplPrevious?.templateRef || previous"
              [ngTemplateOutletContext]="{ disabled: previousDisabled() }"
            ></ng-template>
          </a>
        </li>
        <ng-template
          [ngTemplateOutlet]="tplPages?.templateRef || defaultPages"
          [ngTemplateOutletContext]="{ $implicit: page, pages: pages, disabled: disabled }"
        >
        </ng-template>
        <li *ngIf="directionLinks" class="page-item" [class.disabled]="nextDisabled()">
          <a
            aria-label="Next"
            i18n-aria-label="@@ngb.pagination.next-aria"
            class="page-link"
            href
            (click)="selectPage(page + 1); $event.preventDefault()"
            [attr.tabindex]="nextDisabled() ? '-1' : null"
            [attr.aria-disabled]="nextDisabled() ? 'true' : null"
          >
            <ng-template
              [ngTemplateOutlet]="tplNext?.templateRef || next"
              [ngTemplateOutletContext]="{ disabled: nextDisabled(), currentPage: page }"
            ></ng-template>
          </a>
        </li>

        <li *ngIf="boundaryLinks" class="page-item" [class.disabled]="nextDisabled()">
          <a
            aria-label="Last"
            i18n-aria-label="@@ngb.pagination.last-aria"
            class="page-link"
            href
            (click)="selectPage(pageCount); $event.preventDefault()"
            [attr.tabindex]="nextDisabled() ? '-1' : null"
            [attr.aria-disabled]="nextDisabled() ? 'true' : null"
          >
            <ng-template
              [ngTemplateOutlet]="tplLast?.templateRef || last"
              [ngTemplateOutletContext]="{ disabled: nextDisabled(), currentPage: page }"
            ></ng-template>
          </a>
        </li>
      </ul>
    </div>
  `,
})
export class NgbPaginator extends _NgbPaginatorBase implements OnInit, OnChanges {
  pageCount = 0;
  pages: number[] = [];

  private _initialized = false;

  @ContentChild(NgbPaginatorEllipsis, { static: false }) tplEllipsis?: NgbPaginatorEllipsis;
  @ContentChild(NgbPaginatorFirst, { static: false }) tplFirst?: NgbPaginatorFirst;
  @ContentChild(NgbPaginatorLast, { static: false }) tplLast?: NgbPaginatorLast;
  @ContentChild(NgbPaginatorNext, { static: false }) tplNext?: NgbPaginatorNext;
  @ContentChild(NgbPaginatorNumber, { static: false }) tplNumber?: NgbPaginatorNumber;
  @ContentChild(NgbPaginatorPrevious, { static: false }) tplPrevious?: NgbPaginatorPrevious;
  @ContentChild(NgbPaginatorPages, { static: false }) tplPages?: NgbPaginatorPages;

  /**
   * If `true`, pagination links will be disabled.
   */
  @Input() override disabled = false;

  /**
   * If `true`, the "First" and "Last" page links are shown.
   */
  @Input() boundaryLinks = true;

  /**
   * If `true`, the "Next" and "Previous" page links are shown.
   */
  @Input() directionLinks = true;

  /**
   * If `true`, the ellipsis symbols and first/last page numbers will be shown when `maxSize` > number of pages.
   */
  @Input() ellipses = false;

  /**
   * Whether to rotate pages when `maxSize` > number of pages.
   *
   * The current page always stays in the middle if `true`.
   */
  @Input() rotate = true;

  /**
   *  The number of items in your paginated collection.
   *
   *  Note, that this is not the number of pages. Page numbers are calculated dynamically based on
   *  `collectionSize` and `pageSize`. Ex. if you have 100 items in your collection and displaying 20 items per page,
   *  you'll end up with 5 pages.
   */
  @Input() collectionSize = 0;

  /**
   *  The maximum number of pages to display.
   */
  @Input() maxSize = 5;

  /**
   *  The current page.
   *
   *  Page numbers start with `1`.
   */
  @Input() page = 1;

  /**
   *  The number of items per page.
   */
  @Input() pageSize = 10;

  @Input() pageSizes: number[] = [10, 25, 50, 100];

  /**
   *  An event fired when the page is changed. Will fire only if collection size is set and all values are valid.
   *
   *  Event payload is the number of the newly selected page.
   *
   *  Page numbers start with `1`.
   */
  @Output() pageChange = new EventEmitter<number>(true);

  /**
   * The pagination display size.
   *
   * Bootstrap currently supports small and large sizes.
   */
  @Input() size?: 'sm' | 'lg' | string | null;

  constructor() {
    super();
  }

  ngOnInit() {
    this._initialized = true;
    this._markInitialized();
  }

  ngOnChanges(changes: SimpleChanges) {
    this._updatePages(this.page);
  }

  hasPrevious(): boolean {
    return this.page > 1;
  }

  hasNext(): boolean {
    return this.page < this.pageCount;
  }

  nextDisabled(): boolean {
    return !this.hasNext() || this.disabled;
  }

  previousDisabled(): boolean {
    return !this.hasPrevious() || this.disabled;
  }

  selectPage(pageNumber: number): void {
    this._updatePages(pageNumber);
  }

  isEllipsis(pageNumber: number): boolean {
    return pageNumber === -1;
  }

  public selectPageSize() {
    this.pageChange.emit(this.page);
    this._updatePages(this.page);
  }

  /**
   * Appends ellipses and first/last page number to the displayed pages
   */
  private _applyEllipses(start: number, end: number) {
    if (this.ellipses) {
      if (start > 0) {
        // The first page will always be included. If the displayed range
        // starts after the third page, then add ellipsis. But if the range
        // starts on the third page, then add the second page instead of
        // an ellipsis, because the ellipsis would only hide a single page.
        if (start > 2) {
          this.pages.unshift(-1);
        } else if (start === 2) {
          this.pages.unshift(2);
        }
        this.pages.unshift(1);
      }
      if (end < this.pageCount) {
        // The last page will always be included. If the displayed range
        // ends before the third-last page, then add ellipsis. But if the range
        // ends on third-last page, then add the second-last page instead of
        // an ellipsis, because the ellipsis would only hide a single page.
        if (end < this.pageCount - 2) {
          this.pages.push(-1);
        } else if (end === this.pageCount - 2) {
          this.pages.push(this.pageCount - 1);
        }
        this.pages.push(this.pageCount);
      }
    }
  }

  /**
   * Rotates page numbers based on maxSize items visible.
   * Currently selected page stays in the middle:
   *
   * Ex. for selected page = 6:
   * [5,*6*,7] for maxSize = 3
   * [4,5,*6*,7] for maxSize = 4
   */
  private _applyRotation(): [number, number] {
    let start = 0;
    let end = this.pageCount;
    const leftOffset = Math.floor(this.maxSize / 2);
    const rightOffset = this.maxSize % 2 === 0 ? leftOffset - 1 : leftOffset;

    if (this.page <= leftOffset) {
      // very beginning, no rotation -> [0..maxSize]
      end = this.maxSize;
    } else if (this.pageCount - this.page < leftOffset) {
      // very end, no rotation -> [len-maxSize..len]
      start = this.pageCount - this.maxSize;
    } else {
      // rotate
      start = this.page - leftOffset - 1;
      end = this.page + rightOffset;
    }

    return [start, end];
  }

  /**
   * Paginates page numbers based on maxSize items per page.
   */
  private _applyPagination(): [number, number] {
    const page = Math.ceil(this.page / this.maxSize) - 1;
    const start = page * this.maxSize;
    const end = start + this.maxSize;

    return [start, end];
  }

  private _setPageInRange(newPageNo: number) {
    const prevPageNo = this.page;
    this.page = getValueInRange(newPageNo, this.pageCount, 1);

    if (this.page !== prevPageNo && isNumber(this.collectionSize)) {
      this.pageChange.emit(this.page);
    }
  }

  private _updatePages(newPage: number) {
    this.pageCount = Math.ceil(this.collectionSize / this.pageSize);

    if (!isNumber(this.pageCount)) {
      this.pageCount = 0;
    }

    // fill-in model needed to render pages
    this.pages.length = 0;
    for (let i = 1; i <= this.pageCount; i++) {
      this.pages.push(i);
    }

    // set page within 1..max range
    this._setPageInRange(newPage);

    // apply maxSize if necessary
    if (this.maxSize > 0 && this.pageCount > this.maxSize) {
      let start = 0;
      let end = this.pageCount;

      // either paginating or rotating page numbers
      if (this.rotate) {
        [start, end] = this._applyRotation();
      } else {
        [start, end] = this._applyPagination();
      }

      this.pages = this.pages.slice(start, end);

      // adding ellipses
      this._applyEllipses(start, end);
    }
  }
}

function getValueInRange(value: number, max: number, min = 0): number {
  return Math.max(Math.min(value, max), min);
}

function isNumber(value: any): value is number {
  return !isNaN(toInteger(value));
}

function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}
