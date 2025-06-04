import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, WritableSignal, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { delay, of } from 'rxjs';

import { cl_copy } from 'dfts-helper';
import { BOOTSTRAP_ICONS_VERSION, BiComponent, BiName } from 'dfx-bootstrap-icons';
import { ThemePicker } from 'playground-lib';

@Component({
  template: `
    <nav class="navbar navbar-expand-lg sticky-top">
      <div class="container-xxl justify-content-between justify-content-sm-start flex-row">
        <a class="navbar-brand d-flex align-items-center text-dark gap-1" routerLink="/">
          <span>dfx</span>
          <img ngSrc="assets/bootstrap-logo.png" alt="Bootstrap" height="24" width="30" style="transform: rotate(-20deg)" />
          <span>icons</span>
        </a>
        <ul class="navbar-nav me-auto flex-row gap-2">
          <li class="nav-item">
            <a class="nav-link text-dark" href="https://npmjs.com/dfx-bootstrap-icons#usage" target="_blank" rel="noopener">Usage</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-dark" href="https://npmjs.com/dfx-bootstrap-icons" target="_blank" rel="noopener">NPM</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-dark" href="https://github.com/Dafnik/dfts-common" target="_blank" rel="noopener">GitHub</a>
          </li>
        </ul>
        <div class="d-flex">
          <li class="nav-item d-flex align-items-center">
            <theme-picker />
          </li>
        </div>
      </div>
    </nav>

    <main class="py-lg-4 py-2">
      <div class="container-xxl pb-5">
        <a
          class="d-block d-sm-inline-block text-decoration-none rounded-3 hero-notice mb-4 px-3 py-1"
          target="_blank"
          rel="noopener"
          href="https://github.com/twbs/icons/releases/tag/v{{ bootstrapIconsVersion }}">
          Bootstrap Icons Version
          <strong>v{{ bootstrapIconsVersion }}</strong>
        </a>
        <header class="d-flex flex-column-reverse flex-lg-row align-items-center justify-content-between">
          <div class="col-12 col-lg-7">
            <h1 class="lh-base f0 text-lg-start text-center">dfx-bootstrap-icons</h1>
            <span class="lh-base fs-4">
              Straightforward, state-of-the-art Angular icon library.
              <br />
              Build upon the excellence of Bootstrap Icons providing you with over 2,000 icons in a bundle-size friendly way.
            </span>

            <div class="d-flex mt-4 flex-wrap gap-4">
              <div class="highlight fs-6 rounded-3 d-flex align-items-center gap-4 p-3">
                <div class="code font-monospace">npm i dfx-bootstrap-icons</div>
                <button class="btn" (click)="copy('npm i dfx-bootstrap-icon')">
                  <bi class="copy-icon" [name]="copyIcon()" height="20" width="20" />
                </button>
              </div>
              <a
                class="btn btn-bi-icons btn-lg d-flex align-items-center gap-2"
                href="https://icons.getbootstrap.com"
                role="button"
                target="_blank"
                rel="noopener">
                <img ngSrc="assets/bootstrap-logo.png" alt="Bootstrap Logo" width="32" height="24" />
                Open Bootstrap Icons
              </a>
            </div>
            <div class="d-flex">
              <div class="d-inline-flex mt-3 gap-2"></div>
            </div>
          </div>
          <div class="col-12 col-lg-4 d-flex justify-content-center">
            <img ngSrc="assets/header.png" priority alt="" width="360" height="270" />
          </div>
        </header>
      </div>

      <hr class="mb-5" />

      <div class="container-xxl">
        <router-outlet />
      </div>
    </main>
  `,
  styles: `
    @media (min-width: 540px) {
      .hero-notice {
        border-radius: 5em !important;
      }
    }
    .hero-notice {
      background-color: var(--bs-secondary-bg);
      border: 1px solid #087990;
    }
    .copy-icon {
      color: var(--bs-secondary-color);
    }
    .btn-bi-icons {
      --bs-btn-color: var(--bs-emphasis-color);
      --bs-btn-border-color: var(--bs-emphasis-color);
      --bs-btn-hover-color: var(--bs-body-bg);
      --bs-btn-hover-bg: var(--bs-emphasis-color);
      --bs-btn-hover-border-color: var(--bs-btn-hover-bg);
    }
  `,
  imports: [NgOptimizedImage, RouterLink, RouterOutlet, BiComponent, ThemePicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
})
export class AppComponent {
  bootstrapIconsVersion = BOOTSTRAP_ICONS_VERSION;

  copyIcon: WritableSignal<BiName> = signal('clipboard');

  copy(it: string): void {
    this.copyIcon.set('check-lg');
    of('')
      .pipe(delay(1500))
      .subscribe(() => this.copyIcon.set('clipboard'));
    cl_copy(it);
  }
}
