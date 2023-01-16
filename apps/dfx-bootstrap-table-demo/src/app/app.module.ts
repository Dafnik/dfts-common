import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {DfxPaginationModule, DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AllComponent} from './all/all.component';
import {SimpleComponent} from './simple/simple.component';
import {FilteringComponent} from './filtering/filtering.component';
import {OrderingComponent} from './ordering/ordering.component';
import {PaginationComponent} from './pagination/pagination.component';

@NgModule({
  declarations: [AppComponent, AllComponent, SimpleComponent, FilteringComponent, OrderingComponent, PaginationComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RouterModule,
    DfxTableModule,
    DfxSortModule,
    DfxPaginationModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
