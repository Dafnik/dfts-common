import { ChangeDetectionStrategy, Component, signal, WritableSignal } from "@angular/core";
import { NgOptimizedImage } from "@angular/common";

import { BOOTSTRAP_ICONS_VERSION, IconComponent, IconName } from "dfx-bootstrap-icons";
import { RouterLink, RouterOutlet } from "@angular/router";
import { cl_copy } from "dfts-helper";
import { delay, of } from "rxjs";


@Component({
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, RouterOutlet, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  template: `
    <nav class="navbar navbar-expand-lg sticky-top" data-bs-theme="dark">
      <div
        class="container-xxl d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2">
        <div class="d-flex gap-2">
          <a class="navbar-brand d-flex align-items-center gap-1" routerLink="/">
            <span>dfx</span>
            <img ngSrc="assets/bootstrap-logo.png" alt="Bootstrap" height="24" width="30"
                 style="transform: rotate(-20deg)" />
            <span>icons</span>
          </a>
          <ul class="navbar-nav flex-row gap-2">
            <li class="nav-item">
              <a class="nav-link" routerLink="/usage">Usage</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="https://npmjs.com/dfx-bootstrap-icons" target="_blank" rel="noopener">NPM</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="https://github.com/Dafnik/dfts-common" target="_blank" rel="noopener">GitHub</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="py-2 py-lg-4">
      <div class="container-xxl pb-5">
        <a class="d-block d-sm-inline-block py-1 px-3 mb-4 text-decoration-none rounded-3 hero-notice"
           target="_blank"
           rel="noopener"
           href="https://github.com/twbs/icons/releases/tag/v{{bootstrapIconsVersion}}">
          Bootstrap Icons Version <strong>v{{bootstrapIconsVersion}}</strong>
        </a>
        <header class="d-flex flex-column-reverse flex-lg-row align-items-center justify-content-between">
          <div class="col-12 col-lg-7">
            <h1 class="lh-base f0 text-center text-lg-start">dfx-bootstrap-icons</h1>
            <span class="lh-base fs-4">Straightforward, state-of-the-art Angular icon library.
              <br>Build upon the excellence of Bootstrap Icons providing you with over 2,000 icons in a bundle-size friendly way.</span>

            <div class="d-flex flex-wrap mt-4 gap-4">
              <div class="highlight fs-6 p-3 rounded-3 d-flex gap-4 align-items-center">
                <div class="code font-monospace">npm i dfx-bootstrap-icons</div>
                <button class="btn" (click)="copy('npm i dfx-bootstrap-icon');">
                  <bi [name]="copyIcon()" [color]="copyIcon() === 'check-lg' ? '#198754' : '#FFFFFF'" height="20" width="20" />
                </button>
              </div>
              <a
                class="btn btn-outline-light btn-lg d-flex align-items-center gap-2"
                href="https://icons.getbootstrap.com" role="button"
                target="_blank" rel="noopener">
                <img ngSrc="assets/bootstrap-logo.png" alt="Bootstrap Logo" width="32" height="24" />
                Open Bootstrap Icons
              </a>
            </div>
            <div class="d-flex">
              <div class="d-inline-flex mt-3 gap-2"></div>
            </div>
          </div>
          <div class="col-12 col-lg-4 d-flex justify-content-center">
            <img ngSrc="assets/header.png" alt="" width="400" height="300" />
          </div>
        </header>
      </div>

      <hr class="mb-5" />

      <div class="container-xxl">
        <router-outlet />
      </div>
    </main>
  `,
  styles: [`
    @media (min-width: 540px) {
      .hero-notice {
        border-radius: 5em !important;
      }
    }
    .hero-notice {
      color: rgb(222, 226, 230);
      background-color: rgb(3, 40, 48);
      border: 1px solid #087990;
    }
  `]
})
export class AppComponent {
  bootstrapIconsVersion = BOOTSTRAP_ICONS_VERSION;

  copyIcon : WritableSignal<IconName> = signal("clipboard");

  copy(it: string): void {
    this.copyIcon.set('check-lg');
    of("").pipe(delay(1500)).subscribe(
      () => this.copyIcon.set('clipboard')
    )
    cl_copy(it);
  }
}
