import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Models
import { OverAll } from '../models/over-all';

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
  getOverAllHistoricalData() {
    return this.http.get(`${this.baseUrl}/v2/historical/all`)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  // get countries all data
  getAllCountriesData() {
    return this.http.get(`${this.baseUrl}/v2/countries`)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  // get data for a single country
  getCountryData(country) {
    return this.http.get(`${this.baseUrl}/v2/countries/${country}`)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  // get historical data for single country
  getCountryHistoricalData(country) {
    return this.http.get(`${this.baseUrl}/v2/historical/${country}`)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  //get historical data for all coutries
  getCountriesHistoricalData() {
    return this.http.get(`${this.baseUrl}/v2/historical`)
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
