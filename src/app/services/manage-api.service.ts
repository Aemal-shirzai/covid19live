import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Models
import { OverAll } from '../models/over-all';
import { OverAllHistorical } from '../models/over-all-historical';
import { AllCountries } from '../models/all-countries';
import { Country } from '../models/country';
import { CountryHistorical } from '../models/country-historical';
import { AllCountriesHistorical } from '../models/all-countries-historical';

@Injectable({
  providedIn: 'root'
})
export class ManageApiService {
  // baseUrl: string = "https://corona.lmao.ninja";
  baseUrl: string = "https://disease.sh";
  constructor(private http: HttpClient) { }

  // cases data for all world
  getOverAllData():Observable<OverAll[]> {
    return this.http.get<OverAll[]>(`${this.baseUrl}/v2/all`)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  // historical data for all world
  getOverAllHistoricalData():Observable<OverAllHistorical[]> {
    return this.http.get<OverAllHistorical[]>(`${this.baseUrl}/v2/historical/all`)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  // get countries all data
  getAllCountriesData():Observable<AllCountries[]> {
    return this.http.get<AllCountries[]>(`${this.baseUrl}/v2/countries`)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  // get data for a single country
  getCountryData(country):Observable<Country[]> {
    return this.http.get<Country[]>(`${this.baseUrl}/v2/countries/${country}`)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  // get historical data for single country
  getCountryHistoricalData(country):Observable<CountryHistorical[]> {
    return this.http.get<CountryHistorical[]>(`${this.baseUrl}/v2/historical/${country}`)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  //get historical data for all coutries
  getCountriesHistoricalData():Observable<AllCountriesHistorical[]> {
    return this.http.get<AllCountriesHistorical[]>(`${this.baseUrl}/v2/historical`)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  // get historical data for multiple countries
  getMultipleHistoricalData(countryOne, countryTwo) {
    return this.http.get(`${this.baseUrl}/v2/historical/${countryOne},${countryTwo}`)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }

}
