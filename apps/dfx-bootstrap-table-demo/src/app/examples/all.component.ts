import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";

import { NgbPaginator, NgbSort, NgbTableDataSource } from "dfx-bootstrap-table";
import { Helper } from "../Helper";

@Component({
  selector: 'app-all',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Everything (filtering, sorting and pagination)</h1>

    <!-- Filtering stuff -->
    <form>
      <div class="input-group">
        <input class="form-control" type="text" [formControl]="filter" placeholder="Search" />
      </div>
    </form>

    <table ngb-table [dataSource]="dataSource" ngb-sort #table="ngbTable">
      <ng-container ngbColumnDef="id">
        <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>#</th>
        <td *ngbCellDef="let event; table: table" ngb-cell>{{ event.id }}</td>
      </ng-container>

      <ng-container ngbColumnDef="name">
        <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>Name and something long</th>
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
    <ngb-paginator [pageSizeOptions]="[10, 20, 50, 100]" [length]="dataSource.data.length" showFirstLastButtons/>
  `,
})
export class AllComponent implements AfterViewInit {
  // Filtering
  public filter = new UntypedFormControl();

  // Sorting
  @ViewChild(NgbSort) sort?: NgbSort;

  // Pagination
  @ViewChild(NgbPaginator) pagination?: NgbPaginator;

  public columnsToDisplay = ['id', 'name', 'actions'];
  public dataSource = new NgbTableDataSource(Helper.getTestData(250));

  ngAfterViewInit(): void {
    // Sort has to be set after template initializing
    this.dataSource.paginator = this.pagination;
    this.dataSource.sort = this.sort;

    this.filter.valueChanges.subscribe((value: string) => {
      this.dataSource.filter = value;
    });
  }
}
