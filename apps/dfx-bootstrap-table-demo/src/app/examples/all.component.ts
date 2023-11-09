import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { NgbPaginator, NgbSort, NgbTableDataSource } from 'dfx-bootstrap-table';
import { EventType, Helper } from '../Helper';

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
        <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>Name</th>
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
    <ngb-paginator [collectionSize]="dataSource.data.length"></ngb-paginator>
  `,
})
export class AllComponent implements OnInit, AfterViewInit {
  // Filtering
  public filter = new UntypedFormControl();

  // Sorting
  @ViewChild(NgbSort) sort: NgbSort | undefined;

  // Pagination
  @ViewChild(NgbPaginator) pagination: NgbPaginator | undefined;

  public columnsToDisplay = ['id', 'name', 'actions'];
  public dataSource: NgbTableDataSource<EventType> = new NgbTableDataSource();

  ngOnInit(): void {
    this.dataSource = new NgbTableDataSource<EventType>(Helper.getTestData(250));
  }

  ngAfterViewInit(): void {
    // Sort has to be set after template initializing
    this.dataSource.paginator = this.pagination;
    this.dataSource.sort = this.sort;

    this.filter.valueChanges.subscribe((value: string) => {
      this.dataSource.filter = value;
    });
  }
}
