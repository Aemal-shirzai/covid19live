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
import { CountryGraphsComponent } from './components/country-graphs/country-graphs.component';
import { MapComponent } from './components/map/map.component';
import { CompareComponent } from './components/compare/compare.component';
import { RecommendationsComponent } from './components/recommendations/recommendations.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'countries/:country',component:CountryInfoComponent},
  {path:'map',component:MapComponent},
  {path:'compare',component:CompareComponent},
  {path:'recommendations',component:RecommendationsComponent} ,
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
  HomeComponent,
  CountryGraphsComponent,
  MapComponent,
  CompareComponent,
  RecommendationsComponent
];
