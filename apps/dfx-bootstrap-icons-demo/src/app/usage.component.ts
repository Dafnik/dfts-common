import { ChangeDetectionStrategy, Component } from "@angular/core";


@Component({
  standalone: true,
  imports: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-usage',
  template: `
    <div class="d-flex flex-column gap-5">
      <div>
        <h3>Usage</h3>
        <p>You can use dfx-boostrap-icons in two ways.</p>
        <div class="d-flex flex-column gap-5 mt-4">
          <div class="d-flex">
            <div class="col-12 col-lg-4">
              <h4>Standalone</h4>
              <p>Directly provide icons on configuration.</p>
            </div>
            <div class="col-12 col-lg-8">
              <div class="d-flex w-100 rounded px-4 pt-3 font-monospace" style="background-color:#343A40 ">
                <pre><code [innerText]="importStandaloneCode"></code></pre>
              </div>
            </div>
          </div>
          <div class="d-flex">
            <div class="col-12 col-lg-4">
              <h4>Module</h4>
              <p>Directly provide icons on configuration.</p>
            </div>
            <div class="col-12 col-lg-8">
              <div class="d-flex w-100 rounded px-4 pt-3 font-monospace" style="background-color:#343A40 ">
                <pre><code [innerText]="importModuleCode"></code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3>Importing icons</h3>
        <p>You can import icons in a few ways.</p>
        <div class="d-flex flex-column gap-5 mt-4">
          <div class="d-flex">
            <div class="col-12 col-lg-4">
              <h4>Standalone with configuration</h4>
              <p>Directly provide icons on configuration.</p>
            </div>
            <div class="col-12 col-lg-8">
              <div class="d-flex w-100 rounded px-4 pt-3 font-monospace" style="background-color:#343A40 ">
                <pre><code [innerText]="importStandaloneCode"></code></pre>
              </div>
            </div>
          </div>
          <div class="d-flex">
            <div class="col-12 col-lg-4">
              <h4>Module with configuration</h4>
              <p>Directly provide icons on configuration.</p>
            </div>
            <div class="col-12 col-lg-8">
              <div class="d-flex w-100 rounded px-4 pt-3 font-monospace" style="background-color:#343A40 ">
                <pre><code [innerText]="importModuleCode"></code></pre>
              </div>
            </div>
          </div>
          <div class="d-flex">
            <div class="col-12 col-lg-4">
              <h4>Standalone</h4>
              <p>Just provide the items you need per component.</p>
            </div>
            <div class="col-12 col-lg-8">
              <div class="d-flex w-100 rounded px-4 pt-3 font-monospace" style="background-color:#343A40 ">
                <pre><code [innerText]="importStandaloneComponentCode"></code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 class="mt-5">Configuration</h3>
        <p>You can configure <code>dfx-bootstrap-icons</code> in two ways. Note that you DO NOT have to configure the library.</p>
        <div class="d-flex flex-column gap-5 mt-4">
          <div class="d-flex">
            <div class="col-12 col-lg-4">
              <h4>Standalone (recommended)</h4>
              <p>Configure the library wherever you have a providers array.</p>
            </div>
            <div class="col-12 col-lg-8">
              <div class="d-flex w-100 rounded px-4 pt-3 font-monospace" style="background-color:#343A40 ">
                <pre><code [innerText]="standaloneConfigCode"></code></pre>
              </div>
            </div>
          </div>
          <div class="d-flex">
            <div class="col-12 col-lg-4">
              <h4>Module</h4>
              <p>Configure the library in any module you like.</p>
            </div>
            <div class="col-12 col-lg-8">
              <div class="d-flex w-100 rounded px-4 pt-3 font-monospace" style="background-color:#343A40 ">
                <pre><code [innerText]="moduleConfigCode"></code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class UsageComponent {
  standaloneConfigCode = `import { provideDfxBootstrapIcons, withHeight, withWidth } from "dfx-bootstrap-icons";

bootstrapApplication(AppComponent, {
  providers: [
    provideDfxBootstrapIcons(
      withWidth('32'),
      withHeight('48')
    )
  ]
})`;

  moduleConfigCode = `import { DfxIconsModule, withHeight, withWidth } from "dfx-bootstrap-icons";

@NgModule({
  imports: [
    DfxIconsModule.setup(
      withWidth('32'),
      withHeight('48')
    )
  ],
  ...
})
export class AppModule { }`;

  importStandaloneCode = `import { allIcons, provideDfxBootstrapIcons, withIcons, withWidth, withHeight } from "dfx-bootstrap-icons";

bootstrapApplication(AppComponent, {
  providers: [
    provideDfxBootstrapIcons(
      withIcons(allIcons), // withIcons({ xCircleFill, zeroCircle })
      withWidth('32'),
      withHeight('48')
    )
  ]
})`;


  importModuleCode = `import { DfxIconsModule, withHeight, withWidth, withIcons, allIcons } from "dfx-bootstrap-icons";

@NgModule({
  imports: [
    DfxIconsModule.setup(
      withIcons(allIcons), // withIcons({ xCircleFill, zeroCircle })
      withWidth('32'),
      withHeight('48')
    )
  ],
  ...
})
export class AppModule { }`;

  importStandaloneComponentCode = `import { allIcons, IconComponent, provideIcons } from "dfx-bootstrap-icons";

@Component({
  imports: [ IconComponent ],
  providers: [
    provideIcons(allIcons), // provideIcons({ xCircleFill, zeroCircle })
  ],
  name: 'app-test-component',
  template: '<bi name="x-circle-fill" /> '
})
export class AppComponent { }
  `;

}
