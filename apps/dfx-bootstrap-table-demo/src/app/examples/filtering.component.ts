import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";

import { NgbTableDataSource } from "dfx-bootstrap-table";
import { EventType, Helper } from "../Helper";

@Component({
  selector: 'app-filtering',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Everything (filtering, sorting and pagination)</h1>

    <!-- Filtering stuff -->
    <form>
      <div class="input-group">
        <input class="form-control" type="text" [formControl]="filter" placeholder="Search" />
      </div>
    </form>

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
  `
})
export class FilteringComponent implements OnInit, AfterViewInit {
  // Filtering
  public filter = new UntypedFormControl();

  public columnsToDisplay = ['id', 'name', 'actions'];
  public dataSource: NgbTableDataSource<EventType> = new NgbTableDataSource();

  ngOnInit(): void {
    this.dataSource = new NgbTableDataSource<EventType>(Helper.getTestData(250));
  }

  ngAfterViewInit(): void {
    this.filter.valueChanges.subscribe((value: string) => {
      this.dataSource.filter = value;
    });
  }
}
