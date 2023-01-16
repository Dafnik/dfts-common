import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

import {NgbPaginator, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {EventType, Helper} from '../Helper';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styles: [],
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
