import { NgModule } from "@angular/core";

import { AllComponent } from "./examples/all.component";
import { RouterModule, Routes } from "@angular/router";
import { SimpleComponent } from "./examples/simple.component";
import { OrderingComponent } from "./examples/ordering.component";
import { PaginationComponent } from "./examples/pagination.component";
import { FilteringComponent } from "./examples/filtering.component";

const appRoutes: Routes = [
  {path: '', redirectTo: '/all', pathMatch: 'full'},
  {path: 'all', component: AllComponent},
  {path: 'simple', component: SimpleComponent},
  {path: 'ordering', component: OrderingComponent},
  {path: 'pagination', component: PaginationComponent},
  {path: 'filtering', component: FilteringComponent},
  {path: '**', redirectTo: '/all'},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
