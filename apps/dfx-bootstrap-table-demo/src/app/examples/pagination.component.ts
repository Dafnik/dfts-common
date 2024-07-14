import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';

import { DfxPaginationModule, DfxTableModule, NgbPaginator, NgbTableDataSource } from 'dfx-bootstrap-table';
import { Helper } from '../Helper';

@Component({
  selector: 'app-paginator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DfxTableModule, DfxPaginationModule],
  template: `
    <h1>Pagination</h1>

    <table ngb-table [dataSource]="dataSource()">
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
