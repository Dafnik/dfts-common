import {Component, OnInit} from '@angular/core';

import {NgbTableDataSource} from 'dfx-bootstrap-table';
import {EventType, Helper} from '../Helper';

@Component({
  selector: 'app-simple',
  templateUrl: './simple.component.html',
  styles: [],
})
export class SimpleComponent implements OnInit {
  public columnsToDisplay = ['id', 'name', 'actions'];
  public dataSource: NgbTableDataSource<EventType> = new NgbTableDataSource();

  ngOnInit(): void {
    this.dataSource = new NgbTableDataSource<EventType>(Helper.getTestData(30));
  }
}
