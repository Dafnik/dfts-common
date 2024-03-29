import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DfxPaginationModule, DfxSortModule, DfxTableModule } from 'dfx-bootstrap-table';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AllComponent } from './examples/all.component';
import { SimpleComponent } from './examples/simple.component';
import { FilteringComponent } from './examples/filtering.component';
import { OrderingComponent } from './examples/ordering.component';
import { PaginationComponent } from './examples/pagination.component';
import { ThemePicker } from 'playground-lib';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { biCacheInterceptor } from 'dfx-bootstrap-icons';

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
    ThemePicker,
  ],
  providers: [provideHttpClient(withInterceptors([biCacheInterceptor]))],
  bootstrap: [AppComponent],
})
export class AppModule {}
