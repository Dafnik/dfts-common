import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <main class="container my-auto">
      <section class="hero">
        <h1>playground</h1>
      </section>

      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 card-grid">
        <div class="col">
          <a class="hover-card" href="bootstrap-icons">
            <div class="card-body">
              <h3 class="card-title">dfx-bootstrap-icons</h3>
              <p class="card-text">Angular Bootstrap Icons</p>
            </div>
          </a>
        </div>
        <div class="col">
          <a class="hover-card" href="bootstrap-table">
            <div class="card-body">
              <h3 class="card-title">dfx-bootstrap-table</h3>
              <p class="card-text">Angular table CDK implementation for Bootstrap with filtering, sorting and pagination.</p>
            </div>
          </a>
        </div>
        <div class="col">
          <a class="hover-card" href="qrcode">
            <div class="card-body">
              <h3 class="card-title">dfx-qrcode</h3>
              <p class="card-text">Tiny and simple-to-use Angular QR-Code generator library.</p>
            </div>
          </a>
        </div>
      </div>
    </main>

    <footer>
      <p>
        by
        <a href="https://dafnik.me" target="_blank" rel="noopener">Dafnik</a>
      </p>
    </footer>
  `,
})
export class AppComponent {}
