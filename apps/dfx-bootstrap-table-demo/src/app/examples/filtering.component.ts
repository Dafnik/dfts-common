import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { DfxTableModule, NgbTableDataSource } from 'dfx-bootstrap-table';
import { Helper } from '../Helper';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-filtering',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DfxTableModule, ReactiveFormsModule],
  template: `
    <h1>Everything (filtering, sorting and pagination)</h1>

    <!-- Filtering stuff -->
    <form>
      <div class="input-group">
        <input class="form-control" type="text" [formControl]="filter" placeholder="Search" />
      </div>
    </form>

    <table ngb-table [dataSource]="dataSource()">
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
export class FilteringComponent {
  // Filtering
  filter = new FormControl<string>('');
  filterChanges = toSignal(this.filter.valueChanges, { initialValue: null });

  columnsToDisplay = signal(['id', 'name', 'actions']);

  dataSource = computed(() => {
    const source = new NgbTableDataSource(Helper.getTestData(250));

    source.filter = this.filterChanges() ?? '';

    return source;
  });
}
