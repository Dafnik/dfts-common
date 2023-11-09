import { ModuleWithProviders, NgModule } from "@angular/core";

import { BiComponent } from "./icon.component";
import { IconFeatures } from "./icons.feature";

@NgModule({
  imports: [BiComponent],
  exports: [BiComponent],
})
export class BiModule {
  static setup(...features: IconFeatures[]): ModuleWithProviders<BiModule> {
    console.log(`DfxIconsModule: setup with features and icons`, features);
    return {
      ngModule: BiModule,
      providers: [features.map((it) => it.providers)],
    };
  }
}
