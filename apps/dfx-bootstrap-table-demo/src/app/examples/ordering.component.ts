import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';

import { DfxSortModule, DfxTableModule, NgbSort, NgbTableDataSource } from 'dfx-bootstrap-table';

import { Helper } from '../helper';

@Component({
  selector: 'app-all',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DfxTableModule, DfxSortModule],
  template: `
    <h1>Ordering</h1>

    <table [dataSource]="dataSource()" ngb-table ngb-sort>
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
          <button class="btn btn-sm btn-outline-success m-1" type="button">Edit</button>
          <button class="btn btn-sm btn-outline-danger m-1" type="button">Delete</button>
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
