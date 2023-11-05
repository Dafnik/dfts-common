import { ModuleWithProviders, NgModule } from "@angular/core";

import { IconComponent } from "./icon.component";
import { IconFeatures } from "./icons.feature";

@NgModule({
  imports: [IconComponent],
  exports: [IconComponent],
})
export class DfxIconsModule {
  static setup(...features: IconFeatures[]): ModuleWithProviders<DfxIconsModule> {
    console.log(`DfxIconsModule: setup with features and icons`, features);
    return {
      ngModule: DfxIconsModule,
      providers: [features.map((it) => it.providers)],
    };
  }
}
