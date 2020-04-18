import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ManageApiService {
  baseUrl: string = "https://corona.lmao.ninja";
  constructor(private http: HttpClient) { }

  getOverAllData() {
    return this.http.get(`${this.baseUrl}/v2/all`)
      .pipe(
        catchError(this.errorHandler)
      )
  }
  getOverAllHistoricalData() {
    return this.http.get(`${this.baseUrl}/v2/historical/all`)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  getAllCountriesData(){
    return this.http.get(`${this.baseUrl}/v2/countries`)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  getCountryData(country){
    return this.http.get(`${this.baseUrl}/v2/countries/${country}`)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }

}
