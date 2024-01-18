import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <div class="container container-lg d-flex w-100 h-100 p-3 mx-auto flex-column">
      <main class="px-3 pt-5">
        <h1 class="f0">playground</h1>

        <div class="row row-cols-1 row-cols-lg-3 align-items-stretch g-4 py-5">
          <div class="col">
            <a href="https://playground.dafnik.me/bootstrap-icons" class="card text-bg-dark rounded-4 shadow-lg text-decoration-none">
              <div class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                <h3 class="mb-4 display-6 lh-1 fw-bold">
                  <span class="heading-line heading-line-first">
                    <span class="heading-line-gradient">dfx-bootstrap-icons</span>
                  </span>
                </h3>
                <p>Angular Bootstrap Icons</p>
              </div>
            </a>
          </div>
          <div class="col">
            <a href="https://playground.dafnik.me/bootstrap-table" class="card text-bg-dark rounded-4 shadow-lg text-decoration-none">
              <div class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                <h3 class="mb-4 display-6 lh-1 fw-bold">
                  <span class="heading-line heading-line-second"><span class="heading-line-gradient">dfx-bootstrap-table</span></span>
                </h3>
                <p>Angular table CDK implementation for Bootstrap with filtering, sorting and pagination.</p>
              </div>
            </a>
          </div>
          <div class="col">
            <a href="https://playground.dafnik.me/qrcode" class="card text-bg-dark rounded-4 shadow-lg text-decoration-none">
              <div class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                <h3 class="mb-4 display-6 lh-1 fw-bold">
                  <span class="heading-line heading-line-third"><span class="heading-line-gradient">dfx-qrcode</span></span>
                </h3>
                <p>tiny and simple-to-use Angular QR-Code generator library.</p>
              </div>
            </a>
          </div>
        </div>
      </main>

      <footer class="mt-auto text-white-50">
        <p>by <a href="https://dafnik.me" class="text-white">Dafnik</a></p>
      </footer>
    </div>
  `
})
export class HomeComponent {}
