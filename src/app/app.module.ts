import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { IssuesListComponent } from './issues-list/issues-list.component';
import { PaginationComponent } from './pagination/pagination.component';
import {AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    IssuesListComponent,
    PaginationComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
