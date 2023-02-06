import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

import {NgbPaginator, NgbTableDataSource} from 'dfx-bootstrap-table';
import {EventType, Helper} from '../Helper';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styles: [],
})
export class PaginationComponent implements OnInit, AfterViewInit {
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
  }
}
