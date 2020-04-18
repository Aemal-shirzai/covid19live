import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
// Import ng-circle-progress
import { NgCircleProgressModule } from 'ng-circle-progress';
// import ng2-chart module
import { ChartsModule } from "ng2-charts";
import { BrowserAnimationsModule  } from "@angular/platform-browser/animations";

import { AppRoutingModule, AllComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatSortModule } from "@angular/material/sort";


@NgModule({
  declarations: [
    AppComponent,
    AllComponents,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule  ,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgCircleProgressModule.forRoot(),
    ChartsModule,
    MatSortModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
