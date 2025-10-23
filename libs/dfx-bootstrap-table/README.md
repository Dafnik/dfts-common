# dfx-bootstrap-table

Angular table CDK implementation for Bootstrap with filtering, sorting and pagination.

Working with [@ng-bootstrap/ng-bootstrap](https://npmjs.org/package/@ng-bootstrap/ng-bootstrap) and
[@ngx-bootstrap](https://npmjs.org/package/ngx-bootstrap).

[![npm version](https://img.shields.io/npm/v/dfx-bootstrap-table?label=version&color=%237469B6&cacheSeconds=86400)](https://npmjs.org/package/dfx-bootstrap-table)
[![npm downloads per week](https://img.shields.io/npm/dw/dfx-bootstrap-table?logo=npm&color=%237469B6)](https://npmjs.org/package/dfx-bootstrap-table)
[![npm bundle size](https://img.shields.io/bundlephobia/min/dfx-bootstrap-table?color=%237469B6&cacheSeconds=86400)](https://npmjs.org/package/dfx-bootstrap-table)

### Demo

[![Demo video](https://share.dafnik.me/dfx-bootstrap-table-demo/dfx_bootstrap_table_demo.gif)](https://share.dafnik.me/dfx-bootstrap-table-demo/dfx_bootstrap_table_demo.mp4)
[Click me](https://share.dafnik.me/dfx-bootstrap-table-demo/dfx_bootstrap_table_demo.mp4) (or the video) for a faster
version

**Visit the [demo](https://playground.dafnik.me/bootstrap-table) in the browser.**

### Description

The `ngb-table` provides a Bootstrap styled data-table that can be used to display rows of data.

This table builds on the foundation of the CDK data-table and uses a similar interface for its data input and template,
except that its element and attribute selectors will be prefixed with ngb- instead of cdk-.
For more information on the interface and a detailed look at how the table is implemented, see the
[guide covering the CDK data-table](https://material.angular.io/guide/cdk-table).

### Version compatibility

| Angular    | dfx-bootstrap-table | Bootstrap |
| ---------- | ------------------- | --------- |
| \>= 20.2.5 | 20.1.x              | 5.x.x     |
| 20.x.x     | 20.x.x              | 5.x.x     |
| 20.x.x     | 6.x.x               | 5.x.x     |
| 19.x.x     | 5.x.x               | 5.x.x     |
| 18.x.x     | 4.x.x               | 5.x.x     |
| 17.x.x     | 3.x.x               | 5.x.x     |
| 16.x.x     | 2.x.x               | 5.x.x     |
| 15.x.x     | 1.4.x               | 5.x.x     |
| 14.x.x     | 1.3.x               | 5.x.x     |
| 13.x.x     | 1.1.x               | 5.x.x     |
| 12.x.x     | 1.0.x               | 5.x.x     |

### Credits

Full credits go to the [Angular and Angular Material Team](https://github.com/angular/components) and the
[ng-bootstrap Team](https://ng-bootstrap.github.io). I
literally
copied most of their mat-table implementation and narrowed it down for Bootstrap.

### Features

- Extendable template
- Builtin sorting, filtering and pagination available through `NgbTableDataSource`, `NgbSort` and `NgbPaginatior`

## Usage

### Installation

```shell
npm install dfx-bootstrap-table
```

- _If you have not already installed [@angular/cdk](https://material.angular.io/cdk)_

```shell
npm install @angular/cdk
```

- _If you have not already installed [Bootstrap](https://getbootstrap.com/)_
  ```shell
  npm install bootstrap@latest
  ```
- If you are going to use the filtering code
  ```shell
  npm install @angular/forms@latest
  ```

### Example with everything

This is the code for a table as you see it [above](#demo). Every code piece is located
in [here](https://github.com/Dafnik/dfts-common/tree/main/apps/dfx-bootstrap-table-demo).

[all.component.html](https://github.com/Dafnik/dfts-common/blob/main/apps/dfx-bootstrap-table-demo/src/app/examples/all.component.html)

```angular2html
<!-- Filtering stuff -->
<form>
  <div class="input-group">
    <input class="form-control" type="text" [formControl]="filter"
           placeholder="Search" />
  </div>
</form>

<table ngb-table [dataSource]="dataSource" ngb-sort>
  <ng-container ngbColumnDef="id">
    <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>#</th>
    <td *ngbCellDef="let event" ngb-cell>{{ event.id }}</td>
  </ng-container>

  <ng-container ngbColumnDef="name">
    <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>Name</th>
    <td *ngbCellDef="let event" ngb-cell>{{ event.name }}</td>
  </ng-container>

  <ng-container ngbColumnDef="actions">
    <th *ngbHeaderCellDef ngb-header-cell>Actions</th>
    <td *ngbCellDef="let event" ngb-cell>
      <button
        type="button"
        class="btn btn-sm m-1 btn-outline-success">
        Edit
      </button>
      <button
        type="button"
        class="btn btn-sm m-1 btn-outline-danger">
        Delete
      </button>
    </td>
  </ng-container>

  <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
  <tr *ngbRowDef="let event; columns: columnsToDisplay" ngb-row></tr>
</table>

<ngb-paginator
  [pageIndex]="1"
  [pageSize]="10"
  [length]="dataSource.data.length"></ngb-paginator>
```

[all.component.ts](https://github.com/Dafnik/dfts-common/blob/main/apps/dfx-bootstrap-table-demo/src/app/examples/all.component.ts)

```typescript
import { NgbPaginator, NgbSort, NgbTableDataSource } from 'dfx-bootstrap-table';

export type eventModel = {
  id: number;
  name: string;
};

@Component({
  selector: '...',
})
export class AppComponent implements AfterViewInit {
  // Filtering
  public filter = new FormControl();

  // Sorting
  @ViewChild(NgbSort) sort!: NgbSort;
  @ViewChild(NgbPaginator) paginator!: NgbPaginator;

  public columnsToDisplay = ['id', 'name', 'actions'];
  public dataSource: NgbTableDataSource<eventModel> = new NgbTableDataSource(this.eventModels);

  eventModels = [
    {
      id: 0,
      name: 'Event 1',
    },
    {
      id: 1,
      name: 'Event 2',
    },
    {
      id: 2,
      name: 'Event 3',
    },
    {
      id: 3,
      name: 'Event 4',
    },
  ];

  ngAfterViewInit(): void {
    // Sort has to be set after template initializing
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.filter.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.dataSource.filter = value;
    });
  }
}
```

[app.module.ts](https://github.com/Dafnik/dfts-common/blob/main/apps/dfx-bootstrap-table-demo/src/app/app.module.ts)

```typescript
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { DfxTableModule, DfxSortModule, DfxPaginationModule } from 'dfx-bootstrap-table';

@NgModule({
  declarations: [...],
  imports: [
    BrowserAnimationsModule, // (probably) only once in your project
    ReactiveFormsModule, // only if you use the filtering code
    DfxTableModule,
    DfxSortModule,
    DfxPaginationModule
  ],
})
export class EventsModule {
}
```

### Inputs

| ngb-table properties | Description                          | default |
| -------------------- | ------------------------------------ | ------- |
| hover                | Determines if the table is hoverable | `false` |
| striped              | Determines if the table is striped   | `false` |

| ngb-sort properties | Description                                                                                                     | default |
| ------------------- | --------------------------------------------------------------------------------------------------------------- | ------- |
| ngbSortActive       | The id of the most recently sorted NgbSortable.                                                                 | `''`    |
| ngbSortStart        | The direction to set when an NgbSortable is initially sorted. May be overriden by the NgbSortable's sort start. | `asc`   |
| ngbSortDirection    | The sort direction of the currently active NgbSortable.                                                         |         |
| ngbSortDisableClear | Whether to disable the user from clearing the sort by finishing the sort direction cycle.                       | `false` |

| ngb-paginator properties | Description                                                   | default    |
| ------------------------ | ------------------------------------------------------------- | ---------- |
| pageIndex                | The current page.                                             | `0`        |
| length                   | Length of all items.                                          | `0`        |
| pageSize                 | Number of items to display on a page.                         | `10`       |
| pageSizeOptions          | The set of provided page size options to display to the user. | `number[]` |
| hidePageSize             | Hides the page size.                                          | `false`    |
| showFirstLastButtons     | Show the first and last navigator buttons.                    | `false`    |
| disabled                 | Disables the paginator.                                       | `false`    |

### Getting started (table with filtering, sorting and pagination)

#### 1. Write your ngb-table and provide data

Begin by adding the `<table ngb-table>` component to your template and passing in data.

The simplest way to provide data to the table is by passing a data array to the table's dataSource input. The table will
take the array and render a row for each object in the data array.

```angular2html

<table ngb-table [dataSource]="myDataArray">
  ...
</table>
```

Since the table optimizes for performance, it will not automatically check for changes to the data array.
Instead, when objects are added, removed, or moved on the data array, you can trigger an update to the table's rendered
rows by calling its `renderRows()` method.

While an array is the simplest way to bind data into the data source, it is also the most limited. For more complex
applications,
using a `DataSource` instance is recommended. See the section [Advanced data sources](#advanced-data-sources) below for
more information.

#### 2. Define the column templates

Next, write your table's column templates.

Each column definition should be given a unique name and contain the content for its header and row cells.

Here's a simple column definition with the name `'name'`. The header cell contains the text `"Name"` and each row cell
will render the score property of each row's data.

```angular2html

<ng-container ngbColumnDef="name">
  <th ngb-header-cell *ngbHeaderCellDef> Name</th>
  <td ngb-cell *ngbCellDef="let event"> {{event.name}} </td>
</ng-container>
```

Note that the cell templates are not restricted to only showing simple string values, but are flexible and allow you to
provide any template.

#### 3. Define the row templates

Finally, once you have defined your columns, you need to tell the table which columns will be rendered in the header and
data rows.

To start, create a variable in your component that contains the list of the columns you want to render.

```typescript
columnsToDisplay = ['id', 'name', 'actions'];
```

Then add ngb-header-row and ngb-row to the content of your ngb-table and provide your column list as inputs.

```angular2html

<tr ngb-header-row *ngbHeaderRowDef="columnsToDisplay"></tr>
<tr ngb-row *ngbRowDef="let event; columns: columnsToDisplay"></tr>
```

Note that this list of columns provided to the rows can be in any order, not necessarily the order in which you wrote
the column definitions.
Also, you do not necessarily have to include every column that was defined in your template.

This means that by changing your column list provided to the rows, you can easily re-order and include/exclude columns
dynamically.

#### 4. Filtering

dfx-bootstrap-table does not provide a specific component to be used for filtering the `NgbTable` since there is no
single common approach to adding a filter UI to table data.

A general strategy is to add an input where users can type in a filter string and listen to this input to change what
data is offered from the data source to the table.

If you are using the `NgbTableDataSource`, simply provide the filter string to the `NgbTableDataSource`.
The data source will reduce each row data to a serialized form and will filter out the row if it does not contain the
filter string.
By default, the row data reducing function will concatenate all the object values and convert them to lowercase.

For example, the data object `{id: 123, name: 'Mr. Smith', favoriteColor: 'blue'}` will be reduced to `123mr. smithblue`
.
If your filter string was `blue` then it would be considered a match because it is contained in the reduced string, and
the row would be displayed in the table.

To override the default filtering behavior, a custom `filterPredicate` function can be set which takes a data object and
filter string and returns true if the data object is considered a match.

If you want to show a message when not data matches the filter, you can use the `*ngbNoDataRow` directive.

#### 5. Sorting

To add sorting behavior to the table, add the `ngb-sort` directive to the table and add `ngb-sort-header` to each column
header cell that should trigger sorting.
Note that you have to import `DfxSortModule` in order to initialize the `ngb-sort` directive.

```angular2html
<!-- Name Column -->
<ng-container ngbColumnDef="name">
  <th ngb-header-cell *ngbHeaderCellDef ngb-sort-header> Name</th>
  <td ngb-cell *ngbCellDef="let event"> {{event.name}} </td>
</ng-container>
```

If you are using the `NgbTableDataSource` for your table's data source, provide the `NgbSort` directive to the data
source, and it will automatically listen for sorting changes and change the order of data rendered by the table.

By default, the `NgbTableDataSource` sorts with the assumption that the sorted column's name matches the data property
name that the column displays. For example, the following column definition is named position, which matches the name of
the property displayed in the row cell.

Note that if the data properties do not match the column names, or if a more complex data property accessor is required,
then a custom `sortingDataAccessor` function can be set to override the default data accessor on
the `NgbTableDataSource`.

If you are not using the `NgbTableDataSource`, but instead implementing custom logic to sort your data, listen to the
sort's `(ngbSortChange)` event and re-order your data according to the sort state. If you are providing a data array
directly to the table, don't forget to call `renderRows()` on the table, since it will not automatically check the array
for changes.

#### 6. Pagination

To paginate the table's data, add a <ngb-paginator> after the table.

If you are using the NgbTableDataSource for your table's data source, simply provide the `NgbPaginator` to your data
source. It will automatically listen for page changes made by the user and send the right paged data to the table.

Otherwise if you are implementing the logic to paginate your data, you will want to listen to the paginator's (page)
output and pass the right slice of data to your table.

### Advanced data sources

The simplest way to provide data to your table is by passing a data array. More complex use-cases may benefit from a
more flexible approach involving an Observable stream or by encapsulating your data source logic into a DataSource
class.

##### Observable stream of data arrays

An alternative approach to providing data to the table is by passing an Observable stream that emits the data array to
be rendered each time it is changed. The table will listen to this stream and automatically trigger an update to the
rows each time a new data array is emitted.

##### DataSource

For most real-world applications, providing the table a `DataSource` instance will be the best way to manage data.
The `DataSource` is meant to serve as a place to encapsulate any sorting, filtering and data retrieval logic specific to
the application.

A `DataSource` is simply a class that has at a minimum the following methods: `connect` and `disconnect`. The `connect`
method will be called by the table to provide an `Observable` that emits the data array that should be rendered. The
table will call `disconnect` when the table is destroyed, which may be the right time to clean up any subscriptions that
may have been registered in the `connect`
method.

Although dfx-bootstrap-table provides a ready-made table DataSource class, `NgbTableDataSource`, you may want to create
your own custom `DataSource` class for more complex use cases. This can be done by extending the abstract `DataSource`
class with a custom `DataSource` class that then implements the connect and disconnect methods. For use cases where the
custom `DataSource` must also inherit
functionality by extending a different base class, the DataSource base class can be implemented
instead (`MyCustomDataSource extends SomeOtherBaseClass implements DataSource`) to respect Typescript's restriction to
only implement one base class.

By [Dafnik](https://dafnik.me)
