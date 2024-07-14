import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { DfxTableModule, NgbTableDataSource } from 'dfx-bootstrap-table';
import { Helper } from '../Helper';

@Component({
  selector: 'app-simple',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DfxTableModule],
  template: `
    <h1>Simple</h1>

    <table ngb-table [dataSource]="dataSource()" striped>
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
  `,
})
export class SimpleComponent {
  columnsToDisplay = signal(['id', 'name', 'actions']);
  dataSource = signal(new NgbTableDataSource(Helper.getTestData(30)));
}
