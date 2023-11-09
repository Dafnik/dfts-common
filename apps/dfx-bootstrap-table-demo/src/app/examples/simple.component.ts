import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { NgbTableDataSource } from 'dfx-bootstrap-table';
import { EventType, Helper } from '../Helper';

@Component({
  selector: 'app-simple',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Simple</h1>

    <table ngb-table [dataSource]="dataSource" #table="ngbTable">
      <ng-container ngbColumnDef="id">
        <th *ngbHeaderCellDef ngb-header-cell>#</th>
        <td *ngbCellDef="let event; table: table" ngb-cell>{{ event.id }}</td>
      </ng-container>

      <ng-container ngbColumnDef="name">
        <th *ngbHeaderCellDef ngb-header-cell>Name</th>
        <td *ngbCellDef="let event; table: table" ngb-cell>{{ event.name }}</td>
      </ng-container>

      <ng-container ngbColumnDef="actions">
        <th *ngbHeaderCellDef ngb-header-cell>Actions</th>
        <td *ngbCellDef="let event" ngb-cell>
          <button type="button" class="btn btn-sm m-1 btn-outline-success">Edit</button>
          <button type="button" class="btn btn-sm m-1 btn-outline-danger">Delete</button>
        </td>
      </ng-container>

      <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
      <tr *ngbRowDef="let event; columns: columnsToDisplay" ngb-row></tr>
    </table>
  `,
})
export class SimpleComponent implements OnInit {
  public columnsToDisplay = ['id', 'name', 'actions'];
  public dataSource: NgbTableDataSource<EventType> = new NgbTableDataSource();

  ngOnInit(): void {
    this.dataSource = new NgbTableDataSource<EventType>(Helper.getTestData(30));
  }
}
