import { Component, OnInit } from '@angular/core';
import { ManageApiService } from 'src/app/services/manage-api.service';

import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {
  data: any = [];
  historicalData: any = [];
  error: boolean = false;
  loading: boolean = true;
  // searching
  searchKeyOneStatus: boolean = false
  searchKeyOne: string = ""
  searchKeyTwoStatus: boolean = false
  searchKeyTwo: string = ""
  comparing: boolean = false
  barChartCountryOneData;
  barChartCountryTwoData;
  linearChartCountryOneData;
  linearChartCountryTwoData;


  // bar chart total cases comparing propertiess
  public totalCasesData: Array<any>;
  public totalCasesLabels: Label[] = [];
  public totalCasesColors: Color[];

  // linear chart total cases historical comparing propertiess
  public totalCasesHistoricalData: Array<any>;
  public totalCasesHistoricalLabels: Label[] = [];
  public totalCasesHistoricalColors: Color[];

  // bar chart total Deaths comparing propertiess
  public totalDeathsData: Array<any>;
  public totalDeathsLabels: Label[] = [];
  public totalDeathsColors: Color[];

  // linear chart total Deaths historical comparing propertiess
  public totalDeathsHistoricalData: Array<any>;
  public totalDeathsHistoricalLabels: Label[] = [];
  public totalDeathsHistoricalColors: Color[];

  // bar chart total Recovered comparing propertiess
  public totalRecoveredData: Array<any>;
  public totalRecoveredLabels: Label[] = [];
  public totalRecoveredColors: Color[];

  // linear chart total REcoverd historical comparing propertiess
  public totalRecoveredHistoricalData: Array<any>;
  public totalRecoveredHistoricalLabels: Label[] = [];
  public totalRecoveredHistoricalColors: Color[];

  // bar chart total new cases and deaths comparing propertiess
  public totalNewsCasesDeathsData: Array<any>;
  public totalNewsCasesDeathsLabels: Label[] = [];
  public totalNewsCasesDeathsColors: Color[];

  // bar chart total new cases and deaths comparing propertiess
  public totalTestsAndPerMillionData: Array<any>;
  public totalTestsAndPerMillionLabels: Label[] = [];
  public totalTestsAndPerMillionColors: Color[];


  // bar chart total new cases and deaths comparing propertiess
  public totalCasesandDeathsPerMillionData: Array<any>;
  public totalCasesandDeathsPerMillionLabels: Label[] = [];
  public totalCasesandDeathsPerMillionColors: Color[];

  constructor(
    private apiService: ManageApiService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.apiService.getAllCountriesData().subscribe
      (
        data => {
          this.loading = false
          this.data = data
        },
        error => {
          this.loading = false
          this.error = true
        }
      )

    this.apiService.getCountriesHistoricalData().subscribe
      (
        data => {
          this.historicalData = data
        },
        error => {
          this.error = true
        }
      )
  }

  // on change of select field
  selectCountry(type) {
    if (type === "searchKeyOne") {
      if (this.searchKeyOne !== "") {
        this.searchKeyOneStatus = true
      } else {
        this.searchKeyOneStatus = false
      }
    } else {
      if (this.searchKeyTwo !== "") {
        this.searchKeyTwoStatus = true
      } else {
        this.searchKeyTwoStatus = false
      }
    }
  }

  // the function which compare data between two countries
  compareData(event) {
    this.resetData()
    this.comparing = true
    event.target.innerHTML = "comparing..."
    // load all countries data into a variable
    for (var key in this.data) {
      if (this.data[key].country === this.searchKeyOne) {
        this.barChartCountryOneData = this.data[key]
      }
      if (this.data[key].country === this.searchKeyTwo) {
        this.barChartCountryTwoData = this.data[key]
      }
    }
    // load all historical data into a variable Note: the null provice mean to load all data not for a specific province
    for (var key in this.historicalData) {
      if (this.historicalData[key].country === this.searchKeyOne && this.historicalData[key].province === null) {
        this.linearChartCountryOneData = this.historicalData[key]
      }
      if (this.historicalData[key].country === this.searchKeyTwo && this.historicalData[key].province === null) {
        this.linearChartCountryTwoData = this.historicalData[key]
      }
    }
    // Call all the functions to draw chart which are created below
    this.setTotalCasesData()
    this.setTotalCasesHistoricalData()
    this.setTotalDeathsData()
    this.setTotalDeathsHistoricalData()
    this.setTotalRecoveredData()
    this.setTotalRecoveredHistoricalData()
    this.setTotalNewsCasesDeathsData()
    this.setTotalTestandTestPerMillionData()
    this.setTotalCasesandDeathsPerMillionData()

    this.comparing = false
    event.target.innerHTML = "compare"
  }

  // properties for bar charts only
  public barChartType = "bar";
  public barChartOptions = {
    legend: {
      position: "bottom"
    },
    scaleShowVerticalLines: false,
    scaleShowDrawborder: false,
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      datalabels: {
        // anchor:"end",
        clamp: true,
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: (value, ctx) => {
          return this.numberWithCommas(value)
        },
      },
    },
  };
  // properties for linear charts only
  public linearChartType = "line";
  public linearChartOptions = {
    legend: {
      position: "bottom"
    },
    scaleShowVerticalLines: false,
    scaleShowDrawborder: false,
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      datalabels: {
        display: false
      },
    },
  };
  // Properties for all charts
  public chartsPlugin = [pluginDataLabels];
  public chartsLegend = "true";

  // set total cases data for bar chart
  setTotalCasesData() {
    this.totalCasesData = [
      { data: [this.barChartCountryOneData.cases], "label": this.searchKeyOne },
      { data: [this.barChartCountryTwoData.cases], "label": this.searchKeyTwo },
    ]
    this.totalCasesLabels = ["Total Cases"]
    this.totalCasesColors = [
      { backgroundColor: "rgb(153, 204, 204, 0.5)", hoverBackgroundColor: "rgb(153, 204, 204, 0.9)" },
      { backgroundColor: 'rgb(40, 167, 69, 0.5)', hoverBackgroundColor: 'rgb(40, 167, 69, 0.9)', },
    ];
  }

  // set total cases historical data
  setTotalCasesHistoricalData() {
    let allCasesCountryOne = this.linearChartCountryOneData['timeline'].cases;
    let allCasesCountryTwo = this.linearChartCountryTwoData['timeline'].cases;
    this.totalCasesHistoricalData = [
      { data: Object.values(allCasesCountryOne), label: this.searchKeyOne, fill: true },
      { data: Object.values(allCasesCountryTwo), label: this.searchKeyTwo, fill: true },
    ];
    for (var key in Object.keys(allCasesCountryOne)) {
      this.totalCasesHistoricalLabels.push(this.transformDate(Object.keys(allCasesCountryOne)[key]))
    }
    this.totalCasesHistoricalColors = [
      { backgroundColor: "rgb(153, 204, 204, 0.5)", hoverBackgroundColor: "rgb(153, 204, 204, 0.9)" },
      { backgroundColor: 'rgb(40, 167, 69, 0.5)', hoverBackgroundColor: 'rgb(40, 167, 69, 0.9)', },
    ]
  }

  //set total deaths for bar chart
  setTotalDeathsData() {
    this.totalDeathsData = [
      { data: [this.barChartCountryOneData.deaths], "label": this.searchKeyOne },
      { data: [this.barChartCountryTwoData.deaths], "label": this.searchKeyTwo },
    ]
    this.totalDeathsLabels = ["Total Deaths"]
    this.totalDeathsColors = [
      { backgroundColor: "rgb(220, 53, 69, 0.3)" }, { backgroundColor: 'rgb(255,69,0,0.5)' },
    ];
  }

  //set total deaths historical data chart
  setTotalDeathsHistoricalData() {
    let allDeathsCountryOne = this.linearChartCountryOneData['timeline'].deaths;
    let allDeathsCountryTwo = this.linearChartCountryTwoData['timeline'].deaths;
    this.totalDeathsHistoricalData = [
      { data: Object.values(allDeathsCountryOne), label: this.searchKeyOne, fill: false },
      { data: Object.values(allDeathsCountryTwo), label: this.searchKeyTwo, fill: false },
    ];
    for (var key in Object.keys(allDeathsCountryOne)) {
      this.totalDeathsHistoricalLabels.push(this.transformDate(Object.keys(allDeathsCountryOne)[key]))
    }
    this.totalDeathsHistoricalColors = [
      { borderColor: "rgb(220, 53, 69, 0.3)" }, { borderColor: 'rgb(255,69,0,0.5)' },
    ]
  }

  //set total deaths for bar chart
  setTotalRecoveredData() {
    this.totalRecoveredData = [
      { data: [this.barChartCountryOneData.recovered], "label": this.searchKeyOne },
      { data: [this.barChartCountryTwoData.recovered], "label": this.searchKeyTwo },
    ]
    this.totalRecoveredLabels = ["Total Deaths"]
    this.totalRecoveredColors = [
      { backgroundColor: "rgb(153, 204, 204, 0.5)", hoverBackgroundColor: "rgb(153, 204, 204, 0.9)" },
      { backgroundColor: 'rgb(40, 167, 69, 0.5)', hoverBackgroundColor: 'rgb(40, 167, 69, 0.9)', },
    ];
  }

  //set total deaths historical data chart
  setTotalRecoveredHistoricalData() {
    let allRecoveredCountryOne = this.linearChartCountryOneData['timeline'].recovered;
    let allRecoveredCountryTwo = this.linearChartCountryTwoData['timeline'].recovered;
    this.totalRecoveredHistoricalData = [
      { data: Object.values(allRecoveredCountryOne), label: this.searchKeyOne, fill: false },
      { data: Object.values(allRecoveredCountryTwo), label: this.searchKeyTwo, fill: false },
    ];
    for (var key in Object.keys(allRecoveredCountryOne)) {
      this.totalRecoveredHistoricalLabels.push(this.transformDate(Object.keys(allRecoveredCountryOne)[key]))
    }
    this.totalRecoveredHistoricalColors = [
      { borderColor: "rgb(153, 204, 204, 0.5)", hoverBackgroundColor: "rgb(153, 204, 204, 0.9)" },
      { borderColor: 'rgb(40, 167, 69, 0.5)', hoverBackgroundColor: 'rgb(40, 167, 69, 0.9)', },
    ]
  }

  //set total deaths for bar chart
  setTotalNewsCasesDeathsData() {
    this.totalNewsCasesDeathsData = [
      { data: [this.barChartCountryOneData.todayCases, this.barChartCountryOneData.todayDeaths], "label": this.searchKeyOne },
      { data: [this.barChartCountryTwoData.todayCases, this.barChartCountryTwoData.todayDeaths], "label": this.searchKeyTwo },
    ]
    this.totalNewsCasesDeathsLabels = ["Today Cases", "Today Deaths"]
    this.totalNewsCasesDeathsColors = [
      { backgroundColor: "rgb(153, 204, 204, 0.5)", hoverBackgroundColor: "rgb(153, 204, 204, 0.9)" },
      { backgroundColor: 'rgb(40, 167, 69, 0.5)', hoverBackgroundColor: 'rgb(40, 167, 69, 0.9)', },
    ];
  }

  //set total deaths for bar chart
  setTotalTestandTestPerMillionData() {
    this.totalTestsAndPerMillionData = [
      { data: [this.barChartCountryOneData.tests, this.barChartCountryOneData.testsPerOneMillion], "label": this.searchKeyOne },
      { data: [this.barChartCountryTwoData.tests, this.barChartCountryTwoData.testsPerOneMillion], "label": this.searchKeyTwo },
    ]
    this.totalTestsAndPerMillionLabels = ["Total Tests", "Test Per One Million"]
    this.totalTestsAndPerMillionColors = [
      { backgroundColor: "rgb(153, 204, 204, 0.5)", hoverBackgroundColor: "rgb(153, 204, 204, 0.9)" },
      { backgroundColor: 'rgb(40, 167, 69, 0.5)', hoverBackgroundColor: 'rgb(40, 167, 69, 0.9)', },
    ];
  }

  //set total caces and deaths per on million for bar chart
  setTotalCasesandDeathsPerMillionData() {
    this.totalCasesandDeathsPerMillionData = [
      { data: [this.barChartCountryOneData.casesPerOneMillion, this.barChartCountryOneData.deathsPerOneMillion], "label": this.searchKeyOne },
      { data: [this.barChartCountryTwoData.casesPerOneMillion, this.barChartCountryTwoData.deathsPerOneMillion], "label": this.searchKeyTwo },
    ]
    this.totalCasesandDeathsPerMillionLabels = ["Cases/One Million", "Deaths/One Million"]
    this.totalCasesandDeathsPerMillionColors = [
      { backgroundColor: "rgb(153, 204, 204, 0.5)", hoverBackgroundColor: "rgb(153, 204, 204, 0.9)" },
      { backgroundColor: 'rgb(40, 167, 69, 0.5)', hoverBackgroundColor: 'rgb(40, 167, 69, 0.9)', },
    ];
  }

  // transform date to new formate
  transformDate(date) {
    return this.datePipe.transform(date, 'MMM d')
  }

  // to seperate 3 digits numbe with comma
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // to refres the component by calling ngOnInit()
  refresh() {
    this.ngOnInit()
    this.error = false
    this.loading = true
  }

  // to reset the data of charts property
  resetData() {
    this.totalCasesData = []
    this.totalCasesLabels = []

    this.totalCasesHistoricalData = []
    this.totalCasesHistoricalLabels = []

    this.totalDeathsData = []
    this.totalDeathsLabels = []

    this.totalDeathsHistoricalData = []
    this.totalDeathsHistoricalLabels = []

    this.totalRecoveredData = []
    this.totalRecoveredLabels = []

    this.totalRecoveredHistoricalData = []
    this.totalRecoveredHistoricalLabels = []

    this.totalNewsCasesDeathsData = []
    this.totalNewsCasesDeathsLabels = []

    this.totalTestsAndPerMillionData = []
    this.totalTestsAndPerMillionLabels = []

    this.totalCasesandDeathsPerMillionData = []
    this.totalCasesandDeathsPerMillionLabels = []
  }
}
