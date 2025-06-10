import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { debounceTime } from 'rxjs';

import { cl_copy } from 'dfts-helper';
import { BiComponent, BiNameList } from 'dfx-bootstrap-icons';
import { injectWindow } from 'dfx-helper';

import { LoadIconComponent } from './load-icon.component';

@Component({
  template: `
    <div class="d-flex flex-column gap-2">
      <input class="form-control" id="search" [formControl]="searchCtrl" type="text" placeholder="Search for icons..." />

      <div class="d-flex justify-content-end">
        <div class="badge bg-secondary rounded-pill">Showing {{ searchResults().length }} of {{ IconNameList.length }}</div>
      </div>

      <app-load-icon />

      <div class="row row-cols-6 justify-content-between gap-2">
        @for (icon of searchResults(); track icon) {
          <div class="icon-div mb-2" (click)="copy(icon)" style="min-width: 110px">
            <div class="icon-block mb-2 rounded px-3 py-5 text-center">
              @defer (on viewport) {
                <bi [name]="icon" />
              } @placeholder (minimum 500ms) {
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              }
            </div>
            <div class="text-muted text-decoration-none d-flex justify-content-center gap-2 pt-1">
              <strong>{{ icon }}</strong>
              <a href="https://icons.getbootstrap.com/icons/{{ icon }}/" target="_blank">
                <bi name="box-arrow-up-right" size="16" />
              </a>
            </div>
          </div>
        } @empty {
          <li class="d-flex w-100 justify-content-center">
            <div class="d-flex align-items-center gap-2">
              <bi name="exclamation-octagon-fill" height="24" width="24" ariaLabel="Test" />
              <span>Nothing found.</span>
            </div>
          </li>
        }
      </div>
    </div>

    <div class="to-top" [ngClass]="{ 'show-scrollTop': windowScrolled() }">
      <button class="btn btn-primary d-flex align-items-center gap-2" (click)="scrollToTop()" type="button">
        Scroll to top
        <bi name="arrow-up-circle-fill" />
      </button>
    </div>
  `,
  styles: `
    .icon-div:hover {
      cursor: copy;
    }
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
      right: 0;
      position: fixed;
      opacity: 0;
    }

    .show-scrollTop {
      opacity: 1 !important;
      transition: all 0.2s ease-in-out;
    }
  `,
  imports: [BiComponent, ReactiveFormsModule, NgClass, LoadIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
})
export class HomeComponent implements OnInit {
  window = injectWindow();
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

  protected readonly IconNameList = BiNameList;

  copy(name: string) {
    cl_copy(name);
  }
}
