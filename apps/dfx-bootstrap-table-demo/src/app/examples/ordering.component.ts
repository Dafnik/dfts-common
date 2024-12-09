import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';

import { DfxSortModule, DfxTableModule, NgbSort, NgbTableDataSource } from 'dfx-bootstrap-table';
import { Helper } from '../Helper';

@Component({
  selector: 'app-all',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DfxTableModule, DfxSortModule],
  template: `
    <h1>Ordering</h1>

    <table ngb-table [dataSource]="dataSource()" ngb-sort>
      <ng-container ngbColumnDef="id">
        <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>#</th>
        <td *ngbCellDef="let event" ngb-cell>{{ event.id }}</td>
      </ng-container>

      <ng-container ngbColumnDef="name">
        <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>Name</th>
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
  `,
})
export class OrderingComponent {
  // Sorting
  sort = viewChild.required(NgbSort);

  columnsToDisplay = signal(['id', 'name', 'actions']);

  dataSource = computed(() => {
    const source = new NgbTableDataSource(Helper.getTestData(250));

    source.sort = this.sort();

    return source;
  });
}
