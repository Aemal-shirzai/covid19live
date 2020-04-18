import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { LoadingComponent } from './components/loading/loading.component';
import { OverallCasesComponent } from './components/overall-cases/overall-cases.component';
import { AllCountriesComponent } from './components/all-countries/all-countries.component';
import { CountryInfoComponent } from './components/country-info/country-info.component';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:':country',component:CountryInfoComponent},
  {path:'**',component:NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const AllComponents =[
  LoadingComponent,
  OverallCasesComponent,
  AllCountriesComponent,
  CountryInfoComponent,
  NotFoundComponent,
  HomeComponent

];
