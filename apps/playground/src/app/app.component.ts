import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <div class="container-lg d-flex w-100 h-100 flex-column container mx-auto p-3">
      <main class="px-3 pt-5">
        <h1 class="f0">playground</h1>

        <div class="row row-cols-1 row-cols-lg-3 align-items-stretch g-4 py-5">
          <div class="col">
            <a class="card text-bg-dark rounded-4 text-decoration-none shadow-lg" href="bootstrap-icons">
              <div class="d-flex flex-column h-100 text-shadow-1 p-5 pb-3 text-white">
                <h3 class="display-6 lh-1 fw-bold mb-4">
                  <span class="heading-line heading-line-first">
                    <span class="heading-line-gradient">dfx-bootstrap-icons</span>
                  </span>
                </h3>
                <p>Angular Bootstrap Icons</p>
              </div>
            </a>
          </div>
          <div class="col">
            <a class="card text-bg-dark rounded-4 text-decoration-none shadow-lg" href="bootstrap-table">
              <div class="d-flex flex-column h-100 text-shadow-1 p-5 pb-3 text-white">
                <h3 class="display-6 lh-1 fw-bold mb-4">
                  <span class="heading-line heading-line-second"><span class="heading-line-gradient">dfx-bootstrap-table</span></span>
                </h3>
                <p>Angular table CDK implementation for Bootstrap with filtering, sorting and pagination.</p>
              </div>
            </a>
          </div>
          <div class="col">
            <a class="card text-bg-dark rounded-4 text-decoration-none shadow-lg" href="qrcode">
              <div class="d-flex flex-column h-100 text-shadow-1 p-5 pb-3 text-white">
                <h3 class="display-6 lh-1 fw-bold mb-4">
                  <span class="heading-line heading-line-third"><span class="heading-line-gradient">dfx-qrcode</span></span>
                </h3>
                <p>tiny and simple-to-use Angular QR-Code generator library.</p>
              </div>
            </a>
          </div>
        </div>
      </main>

      <footer class="text-white-50 mt-auto">
        <p>
          by
          <a class="text-white" href="https://dafnik.me">Dafnik</a>
        </p>
      </footer>
    </div>
  `,
})
export class AppComponent {}
