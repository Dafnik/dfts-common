import {NgModule} from '@angular/core';

import {AllComponent} from './all/all.component';
import {RouterModule, Routes} from '@angular/router';
import {SimpleComponent} from './simple/simple.component';
import {OrderingComponent} from './ordering/ordering.component';
import {PaginationComponent} from './pagination/pagination.component';
import {FilteringComponent} from './filtering/filtering.component';

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
