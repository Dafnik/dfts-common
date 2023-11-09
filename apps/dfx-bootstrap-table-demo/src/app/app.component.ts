import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-5">
      <div class="d-flex gap-3 align-items-center mb-4">
        <a class="btn btn-primary" href="all">Everything (filtering, ordering and pagination</a>
        <a class="btn btn-primary" href="simple">Simple</a>
        <a class="btn btn-primary" href="ordering">Ordering</a>
        <a class="btn btn-primary" href="pagination">Pagination</a>
        <a class="btn btn-primary" href="filtering">Filtering</a>

        <theme-picker />
      </div>

      <router-outlet />
    </div>
  `,
})
export class AppComponent {}
