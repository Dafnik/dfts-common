import { ChangeDetectionStrategy, Component } from "@angular/core";


@Component({
  standalone: true,
  imports: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-usage',
  template: `
      <div class="d-flex flex-column gap-2">
          <h2>Usage</h2>
          <span>The component renders an <code>svg</code>.</span>

          <h3 class="mt-4">Configuration</h3>
          <div class="d-flex flex-column gap-5">
              <div class="d-flex">
                  <div class="col-12 col-lg-4">
                      <h4>Standalone (recommended)</h4>
                  </div>
                  <div class="col-12 col-lg-8">
                      <div class="d-flex w-100 rounded px-4 pt-3 font-monospace" style="background-color:#343A40 ">
                          <pre><code [innerHTML]="standaloneConfigCode"></code></pre>
                      </div>
                  </div>
              </div>
              <div class="d-flex">
                  <div class="col-12 col-lg-4">
                      <h4>Module</h4>
                  </div>
                  <div class="col-12 col-lg-8">
                      <div class="d-flex w-100 rounded px-4 pt-3 font-monospace" style="background-color:#343A40 ">
                          <pre><code [innerHTML]="moduleConfigCode"></code></pre>
                      </div>
                  </div>
              </div>
              <div class="d-flex">
                  <div class="col-12 col-lg-4">
                      <h4>Provide Icons in a standalone component</h4>
                  </div>
                  <div class="col-12 col-lg-8">
                      <div class="d-flex w-100 rounded px-4 pt-3 font-monospace" style="background-color:#343A40 ">
                          <pre><code [innerHTML]="standaloneComponentConfigCode"></code></pre>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  `
})
export class UsageComponent {
  standaloneConfigCode = `import { allIcons, provideIcons, withHeight, withWidth } from "dfx-bootstrap-icons";

bootstrapApplication(AppComponent, {
  providers: [
    provideDfxBootstrapIcons(
      withIcons(allIcons), // withIcons({ xCircleFill, zeroCircle })
      withWidth('32'),
      withHeight('48')
    )
  ]
})`;

  moduleConfigCode = `import { allIcons, DfxIconsModule, withHeight, withWidth } from "dfx-bootstrap-icons";

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

  standaloneComponentConfigCode = `import { allIcons, IconComponent, provideIcons } from "dfx-bootstrap-icons";

@Component({
  imports: [ IconComponent ],
  providers: [
    provideIcons(allIcons), // provideIcons({ xCircleFill, zeroCircle })
  ],
  name: 'app-test-component',
  ...
})
export class AppComponent { }
  `;

}
