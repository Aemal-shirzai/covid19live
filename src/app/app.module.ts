import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// Import ng-circle-progress
import { NgCircleProgressModule } from 'ng-circle-progress';
// import ng2-chart module
import { ChartsModule } from "ng2-charts";


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoadingComponent } from './components/loading/loading.component';
import { OverallCasesComponent } from './components/overall-cases/overall-cases.component';
import { AllCountriesComponent } from './components/all-countries/all-countries.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,
    OverallCasesComponent,
    AllCountriesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    // Specify ng-circle-progress as an import
    NgCircleProgressModule.forRoot(),
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
