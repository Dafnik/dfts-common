import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { DfxPaginationModule, DfxSortModule, DfxTableModule, NgbPaginator, NgbSort, NgbTableDataSource } from 'dfx-bootstrap-table';

import { Helper } from '../helper';

@Component({
  selector: 'app-all',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DfxTableModule, DfxSortModule, DfxPaginationModule, ReactiveFormsModule],
  template: `
    <h1>Everything (filtering, sorting and pagination)</h1>

    <!-- Filtering stuff -->
    <form>
      <div class="input-group">
        <input class="form-control" [formControl]="filter" type="text" placeholder="Search" />
      </div>
    </form>

    <table [dataSource]="dataSource()" ngb-table ngb-sort hover>
      <ng-container ngbColumnDef="id">
        <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>#</th>
        <td *ngbCellDef="let event" ngb-cell>{{ event.id }}</td>
      </ng-container>

      <ng-container ngbColumnDef="name">
        <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>Name and something long</th>
        <td *ngbCellDef="let event" ngb-cell>{{ event.name }}</td>
      </ng-container>

      <ng-container ngbColumnDef="actions">
        <th *ngbHeaderCellDef ngb-header-cell>Actions</th>
        <td *ngbCellDef="let event" ngb-cell>
          <button class="btn btn-sm btn-outline-success m-1" type="button">Edit</button>
          <button class="btn btn-sm btn-outline-danger m-1" type="button">Delete</button>
        </td>
      </ng-container>

      <tr *ngbHeaderRowDef="columnsToDisplay()" ngb-header-row></tr>
      <tr *ngbRowDef="let event; columns: columnsToDisplay()" ngb-row></tr>
    </table>
    <ngb-paginator [pageSizeOptions]="[10, 20, 50, 100]" [length]="dataSource().data.length" showFirstLastButtons />
  `,
})
export class AllComponent {
  // Filtering
  filter = new FormControl<string>('');
  filterChanges = toSignal(this.filter.valueChanges, { initialValue: null });

  // Sorting
  sort = viewChild.required(NgbSort);

  // Pagination
  paginator = viewChild.required(NgbPaginator);

  columnsToDisplay = signal(['id', 'name', 'actions']);

  dataSource = computed(() => {
    const source = new NgbTableDataSource(Helper.getTestData(250));

    source.sort = this.sort();
    source.paginator = this.paginator();
    source.filter = this.filterChanges() ?? '';

    return source;
  });
}
