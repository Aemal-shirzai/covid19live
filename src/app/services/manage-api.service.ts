import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ManageApiService {
  baseUrl:string = "https://corona.lmao.ninja";
  constructor(private http:HttpClient) { }

  getOverAllData(){
    return this.http.get(`${this.baseUrl}/all`)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  errorHandler(error: HttpErrorResponse){
    return throwError(error);
  }

}
