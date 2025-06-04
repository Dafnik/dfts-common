import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';

import { DfxPaginationModule, DfxTableModule, NgbPaginator, NgbTableDataSource } from 'dfx-bootstrap-table';

import { Helper } from '../helper';

@Component({
  selector: 'app-paginator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DfxTableModule, DfxPaginationModule],
  template: `
    <h1>Pagination</h1>

    <table [dataSource]="dataSource()" ngb-table>
      <ng-container ngbColumnDef="id">
        <th *ngbHeaderCellDef ngb-header-cell>#</th>
        <td *ngbCellDef="let event" ngb-cell>{{ event.id }}</td>
      </ng-container>

      <ng-container ngbColumnDef="name">
        <th *ngbHeaderCellDef ngb-header-cell>Name</th>
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
export class PaginationComponent {
  // Pagination
  paginator = viewChild.required(NgbPaginator);

  columnsToDisplay = signal(['id', 'name', 'actions']);

  dataSource = computed(() => {
    const source = new NgbTableDataSource(Helper.getTestData(250));

    source.paginator = this.paginator();

    return source;
  });
}
