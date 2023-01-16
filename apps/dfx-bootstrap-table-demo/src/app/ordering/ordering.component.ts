import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

import {NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {EventType, Helper} from '../Helper';

@Component({
  selector: 'app-all',
  templateUrl: './ordering.component.html',
  styles: [],
})
export class OrderingComponent implements OnInit, AfterViewInit {
  // Sorting
  @ViewChild(NgbSort) sort: NgbSort | undefined;

  public columnsToDisplay = ['id', 'name', 'actions'];
  public dataSource: NgbTableDataSource<EventType> = new NgbTableDataSource();

  ngOnInit(): void {
    this.dataSource = new NgbTableDataSource<EventType>(Helper.getTestData(250));
  }

  ngAfterViewInit(): void {
    // Sort has to be set after template initializing
    this.dataSource.sort = this.sort;
  }
}
