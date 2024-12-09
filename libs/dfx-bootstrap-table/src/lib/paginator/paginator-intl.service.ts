import { Injectable, Optional, SkipSelf } from '@angular/core';

import { Subject } from 'rxjs';

/**
 * To modify the labels and text displayed, create a new instance of NgbPaginatorIntl and
 * include it in a custom provider
 */
@Injectable({ providedIn: 'root' })
export class NgbPaginatorIntl {
  /**
   * Stream to emit from when labels are changed. Use this to notify components when the labels have
   * changed after initialization.
   */
  readonly changes: Subject<void> = new Subject<void>();

  /** A label for the page size selector. */
  itemsPerPageLabel = 'Items per page:';

  /** A label for the button that increments the current page. */
  nextPageLabel = 'Next page';

  /** A label for the button that decrements the current page. */
  previousPageLabel = 'Previous page';

  /** A label for the button that moves to the first page. */
  firstPageLabel = 'First page';

  /** A label for the button that moves to the last page. */
  lastPageLabel = 'Last page';

  /** A label for the range of items within the current page and the length of the whole list. */
  getRangeLabel: (page: number, pageSize: number, length: number) => string = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) {
      return `0 of ${length}`;
    }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

    return `${startIndex + 1} – ${endIndex} of ${length}`;
  };
}

/** @docs-private */
export function NGB_PAGINATOR_INTL_PROVIDER_FACTORY(parentIntl: NgbPaginatorIntl): NgbPaginatorIntl {
  return parentIntl || new NgbPaginatorIntl();
}

/** @docs-private */
export const NGB_PAGINATOR_INTL_PROVIDER = {
  // If there is already an NgbPaginatorIntl available, use that. Otherwise, provide a new one.
  provide: NgbPaginatorIntl,
  deps: [[new Optional(), new SkipSelf(), NgbPaginatorIntl]],
  useFactory: NGB_PAGINATOR_INTL_PROVIDER_FACTORY,
};
