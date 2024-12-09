import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { DfxPaginationModule, DfxSortModule, DfxTableModule, NgbPaginator, NgbSort, NgbTableDataSource } from 'dfx-bootstrap-table';
import { Helper } from '../Helper';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-all',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DfxTableModule, DfxSortModule, DfxPaginationModule, ReactiveFormsModule],
  template: `
    <h1>Everything (filtering, sorting and pagination)</h1>

    <!-- Filtering stuff -->
    <form>
      <div class="input-group">
        <input class="form-control" type="text" [formControl]="filter" placeholder="Search" />
      </div>
    </form>

    <table ngb-table [dataSource]="dataSource()" ngb-sort hover>
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
          <button type="button" class="btn btn-sm m-1 btn-outline-success">Edit</button>
          <button type="button" class="btn btn-sm m-1 btn-outline-danger">Delete</button>
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
