import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { debounceTime } from 'rxjs';
import { BiComponent, BiNameList, toEscapedName } from 'dfx-bootstrap-icons';
import { WINDOW } from 'dfx-helper';
import { LoadIconComponent } from './load-icon.component';

@Component({
  template: `
    <div class="d-flex flex-column gap-2">
      <input type="text" class="form-control" id="search" placeholder="Search for icons..." [formControl]="searchCtrl" />

      <div class="d-flex justify-content-end">
        <div class="badge bg-secondary rounded-pill">Showing {{ searchResults().length }} of {{ IconNameList.length }}</div>
      </div>

      <app-load-icon />

      <ul class="row row-cols-3 row-cols-sm-4 row-cols-lg-6 g-2 g-lg-3 list-unstyled list m-0">
        @for (icon of searchResults(); track icon) {
        <li class="col mb-4">
          <a class="d-block text-decoration-none" href="https://icons.getbootstrap.com/icons/{{ icon }}/" target="_blank">
            <div class="px-3 py-5 mb-2 text-center rounded icon-block">
              @defer (on viewport, idle) {
              <bi [name]="icon" />
              } @placeholder (minimum 500ms) {
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              }
            </div>
            <div class="name text-muted text-decoration-none text-center pt-1">
              <strong>{{ icon }}</strong>
            </div>
            <div class="name text-muted text-decoration-none text-center pt-1">{{ escapedName(icon) }}</div>
          </a>
        </li>
        } @empty {
        <li class="d-flex w-100 justify-content-center">
          <div class="d-flex align-items-center gap-2">
            <bi name="exclamation-octagon-fill" height="24" width="24" ariaLabel="Test" />
            <span>Nothing found.</span>
          </div>
        </li>
        }
      </ul>
    </div>

    <div class="to-top" [ngClass]="{ 'show-scrollTop': windowScrolled() }">
      <button type="button" class="btn btn-primary d-flex align-items-center gap-2" (click)="scrollToTop()">
        Scroll to top
        <bi name="arrow-up-circle-fill" />
      </button>
    </div>
  `,
  styles: `
  .icon-block {
    background-color: var(--bs-tertiary-bg);
    color: var(--bs-body-color);
    transition-duration: 0.3s;
  }
  .icon-block:hover {
    transition-duration: 0.4s;
    background-color: var(--bs-secondary-bg);
  }
  .to-top {
    bottom: 0;
    margin: 0 8px 12px 0;
    position: fixed;
    right: 0;
    opacity: 0;
  }

  .show-scrollTop {
    opacity: 1 !important;
    transition: all 0.2s ease-in-out;
  }

  `,
  standalone: true,
  imports: [BiComponent, ReactiveFormsModule, NgClass, LoadIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
})
export class HomeComponent implements OnInit {
  window = inject(WINDOW);
  windowScrolled = signal(false);

  ngOnInit() {
    this.window?.addEventListener('scroll', () => {
      this.windowScrolled.set((this.window?.pageYOffset ?? 0) > 200);
    });
  }

  scrollToTop(): void {
    this.window?.scrollTo(0, 0);
  }

  searchCtrl = new FormControl();

  searchValue = toSignal(this.searchCtrl.valueChanges.pipe(debounceTime(300)), { initialValue: '' });

  searchResults = computed(() => {
    const searchValue = this.searchValue();
    return searchValue.length > 0 ? BiNameList.filter((name) => name.includes(searchValue)) : BiNameList;
  });

  escapedName = (it: string) => toEscapedName(it);

  searchResultsEmpty = computed(() => this.searchResults().length === 0);

  protected readonly IconNameList = BiNameList;
  protected readonly toEscapedName = toEscapedName;
}
