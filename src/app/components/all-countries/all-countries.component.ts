import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageApiService } from 'src/app/services/manage-api.service';
import {Sort} from '@angular/material/sort';

@Component({
  selector: 'app-all-countries',
  templateUrl: './all-countries.component.html',
  styleUrls: ['./all-countries.component.scss']
})
export class AllCountriesComponent implements OnInit {
  @Input() worldInfo:object;
  allCountries;
  countriesDataLoading:boolean = true;
  error:boolean = false

  // search part
  dataForSearch:Array<any> = [];
  searchKey:String = null;

  // Sorting
  beforeSorteData: Array<any> = [];
  // default Sort
  defaultSort:Sort = {active: "cases", direction:"desc"}
  constructor(
    private router:Router, 
    private route:ActivatedRoute, 
    private apiService: ManageApiService) {}
  

  
  ngOnInit() {
    this.apiService.getAllCountriesData().subscribe
    (
      data => {
        this.allCountries = data
        this.countriesDataLoading = false
        this.beforeSorteData = this.allCountries.slice();
        this.sortData(this.defaultSort)
      },
      error =>{
        this.countriesDataLoading = false
        this.error = true
      }
    )
  }


  countryDetails(country){
    event.preventDefault()
    this.router.navigate([`${country}`],{relativeTo:this.route})
  }
  
  refresh(){
    this.error = false
    this.countriesDataLoading = true
    this.ngOnInit()
  }

  searchCountry(){

    if(this.dataForSearch.length < 1){
      this.dataForSearch = this.allCountries;
    }

    if(this.searchKey === ""){
      this.allCountries = this.dataForSearch
    }

    this.allCountries = this.dataForSearch.filter(res => {
      let result = res.country.toLocaleLowerCase().match(this.searchKey.toLocaleLowerCase());
      return result;
    })
  }


  sortData(sort: Sort) {

    if (!sort.active || sort.direction === '') {
      this.allCountries = this.beforeSorteData;
      return;
    }

    this.allCountries = this.allCountries.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'country': return this.compare(a.country, b.country, isAsc);
        case 'cases': return this.compare(a.cases, b.cases, isAsc);
        case 'todayCases1': return this.compare(a.todayCases, b.todayCases, isAsc);
        case 'deaths': return this.compare(a.deaths, b.deaths, isAsc);
        case 'todayDeaths': return this.compare(a.todayDeaths, b.todayDeaths, isAsc);
        case 'recovered': return this.compare(a.recovered, b.recovered, isAsc);
        case 'active': return this.compare(a.active, b.active, isAsc);
        case 'critical': return this.compare(a.critical, b.critical, isAsc);
        case 'casesPerOneMillion': return this.compare(a.casesPerOneMillion, b.casesPerOneMillion, isAsc);
        case 'deathsPerOneMillion': return this.compare(a.deathsPerOneMillion, b.deathsPerOneMillion, isAsc);
        default: return 0;
      }
    });
  }

   compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}



