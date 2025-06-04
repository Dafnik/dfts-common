import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { DfxTableModule, NgbTableDataSource } from 'dfx-bootstrap-table';

import { Helper } from '../helper';

@Component({
  selector: 'app-filtering',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DfxTableModule, ReactiveFormsModule],
  template: `
    <h1>Everything (filtering, sorting and pagination)</h1>

    <!-- Filtering stuff -->
    <form>
      <div class="input-group">
        <input class="form-control" [formControl]="filter" type="text" placeholder="Search" />
      </div>
    </form>

    <table [dataSource]="dataSource()" ngb-table>
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
          <button class="btn btn-sm btn-outline-success m-1" type="button">Edit</button>
          <button class="btn btn-sm btn-outline-danger m-1" type="button">Delete</button>
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
