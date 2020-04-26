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
  // historicalData: any = [];
  worldData: any = [];
  error: boolean = false;
  notFoundErrorOne:String = null;
  notFoundErrorTwo:String = null;
  loading: boolean = true;
  // searching
  searchKeyOneStatus: boolean = false
  searchKeyOne: string = ""
  searchKeyTwoStatus: boolean = false
  searchKeyTwo: string = ""
  totalCountryOneCases;
  totalCountryTwoCases;
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

  // bar chart total new cases comparing propertiess
  public totalNewCasesData: Array<any>;
  public totalNewCasesLabels: Label[] = [];
  public totalNewCasesColors: Color[];

  // bar chart total  deaths comparing propertiess
  public totalNewDeathsData: Array<any>;
  public totalNewDeathsLabels: Label[] = [];
  public totalNewDeathsColors: Color[];

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

    // this.apiService.getCountriesHistoricalData().subscribe
    //   (
    //     data => {
    //       this.loading = false
    //       this.historicalData = data
    //     },
    //     error => {
    //       this.loading = false
    //       this.error = true
    //     }
    //   )

    this.apiService.getOverAllData().subscribe
      (
        data => {
          this.loading = false
          this.worldData = data
        },
        error => {
          this.loading = false
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
    this.setTotalNewCasesData()
    this.setTotalNewDeathsData()
    this.setTotalTestandTestPerMillionData()
    this.setTotalCasesandDeathsPerMillionData()
    this.setTotalCasesData()
    this.setTotalDeathsData()
    this.setTotalRecoveredData()
    this.apiService.getCountryHistoricalData(this.searchKeyOne).subscribe
      (
        data => {
          this.linearChartCountryOneData = data
          this.apiService.getCountryHistoricalData(this.searchKeyTwo).subscribe
          (
            data => {
              this.linearChartCountryTwoData = data
              this.setTotalCasesHistoricalData()
              this.setTotalDeathsHistoricalData()
              this.setTotalRecoveredHistoricalData()
              this.comparing = false
              event.target.innerHTML = "compare"
            },
            error => {
              this.comparing = false
              event.target.innerHTML = "compare"
              this.notFoundErrorTwo = `Could not found historical Data for ${this.searchKeyTwo}`;
            }
          )
        },
        error => {
          this.comparing = false
          event.target.innerHTML = "compare"
          this.notFoundErrorOne = `Could not found  historical Data for ${this.searchKeyOne}`;
        }
      )

      
  
  }

  // set total cases data for bar chart
  setTotalCasesData() {
    this.totalCasesData = [
      {
        data: [
          ((this.barChartCountryOneData.cases / this.worldData.cases) * 100).toFixed(4)],
        "label": `${this.searchKeyOne} (${this.numberWithCommas(this.barChartCountryOneData.cases)})`
      },
      {
        data: [
          ((this.barChartCountryTwoData.cases / this.worldData.cases) * 100).toFixed(4)],
        "label": `${this.searchKeyTwo} (${this.numberWithCommas(this.barChartCountryTwoData.cases)})`
      },
    ]
    this.totalCasesLabels = ["Total Positive Cases In countries (%)"]
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
      {
        data: [
          ((this.barChartCountryOneData.deaths / this.barChartCountryOneData.cases) * 100).toFixed(4)],
        "label": `${this.searchKeyOne} (${this.numberWithCommas(this.barChartCountryOneData.deaths)})`
      },
      {
        data: [
          ((this.barChartCountryTwoData.deaths / this.barChartCountryTwoData.cases) * 100).toFixed(4)],
        "label": `${this.searchKeyTwo} (${this.numberWithCommas(this.barChartCountryTwoData.deaths)})`
      },
    ]
    this.totalDeathsLabels = ["Total Deaths In Countires (%)"]
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
      {
        data: [
          ((this.barChartCountryOneData.recovered / this.barChartCountryOneData.cases) * 100).toFixed(4)],
        "label": `${this.searchKeyOne} (${this.numberWithCommas(this.barChartCountryOneData.recovered)})`
      },
      {
        data: [
          ((this.barChartCountryTwoData.recovered / this.barChartCountryTwoData.cases) * 100).toFixed(4)],
        "label": `${this.searchKeyTwo} (${this.numberWithCommas(this.barChartCountryTwoData.recovered)})`
      },
    ]
    this.totalRecoveredLabels = ["Total Recovered In Countries (%)"]
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
  setTotalNewCasesData() {
    this.totalNewCasesData = [
      {
        data: [
          ((this.barChartCountryOneData.todayCases / this.worldData.todayCases) * 100).toFixed(4)],
        "label": `${this.searchKeyOne} (${this.numberWithCommas(this.barChartCountryOneData.todayCases)})`
      },
      {
        data: [
          ((this.barChartCountryTwoData.todayCases / this.worldData.todayCases) * 100).toFixed(4)],
        "label": `${this.searchKeyTwo} (${this.numberWithCommas(this.barChartCountryTwoData.todayCases)})`
      },
    ]
    this.totalNewCasesLabels = ["Total New/Today Positive Cases In Countries(%)"]
    this.totalNewCasesColors = [
      { backgroundColor: "rgb(153, 204, 204, 0.5)" },
      { backgroundColor: 'rgb(40, 167, 69, 0.5)' },
    ];

  }
  //set total deaths for bar chart
  setTotalNewDeathsData() {
    this.totalNewDeathsData = [
      {
        data: [
          ((this.barChartCountryOneData.todayDeaths / this.barChartCountryOneData.todayCases) * 100).toFixed(4)],
        "label": `${this.searchKeyOne} (${this.numberWithCommas(this.barChartCountryOneData.todayDeaths)})`
      },
      {
        data: [
          ((this.barChartCountryTwoData.todayDeaths / this.barChartCountryTwoData.todayCases) * 100).toFixed(4)],
        "label": `${this.searchKeyTwo} (${this.numberWithCommas(this.barChartCountryTwoData.todayDeaths)})`
      },
    ]
    this.totalNewDeathsLabels = ["Total New/Today Death Cases In Countries (%)"]
    this.totalNewDeathsColors = [
      { backgroundColor: "rgb(153, 204, 204, 0.5)" },
      { backgroundColor: 'rgb(40, 167, 69, 0.5)' },
    ];
  }


  //set total caces and deaths per on million for bar chart
  setTotalCasesandDeathsPerMillionData() {
    this.totalCasesandDeathsPerMillionData = [
      {
        data: [
          ((this.barChartCountryOneData.casesPerOneMillion / 1000000) * 100).toFixed(4),
          ((this.barChartCountryOneData.deathsPerOneMillion / 1000000) * 100).toFixed(4)
        ],
        "label": this.searchKeyOne
      },
      {
        data: [
          ((this.barChartCountryTwoData.casesPerOneMillion / 1000000) * 100).toFixed(4),
          ((this.barChartCountryTwoData.deathsPerOneMillion / 1000000) * 100).toFixed(4)
        ],
        "label": this.searchKeyTwo
      },
    ]
    this.totalCasesandDeathsPerMillionLabels = ["Cases Per One Million (%)", "Deaths Per One Million (%)"]
    this.totalCasesandDeathsPerMillionColors = [
      { backgroundColor: "rgb(153, 204, 204, 0.5)", hoverBackgroundColor: "rgb(153, 204, 204, 0.9)" },
      { backgroundColor: 'rgb(40, 167, 69, 0.5)', hoverBackgroundColor: 'rgb(40, 167, 69, 0.9)', },
    ];
  }

  //set total tests nad deaths per one million
  setTotalTestandTestPerMillionData() {
    this.totalTestsAndPerMillionData = [
      {
        data: [
          ((this.barChartCountryOneData.testsPerOneMillion / 1000000) * 100).toFixed(4)
        ],
        "label": `${this.searchKeyOne} (${this.numberWithCommas(this.barChartCountryOneData.testsPerOneMillion)})`
      },
      {
        data: [
          ((this.barChartCountryTwoData.testsPerOneMillion / 1000000) * 100).toFixed(4)
        ],
        "label": `${this.searchKeyTwo} (${this.numberWithCommas(this.barChartCountryTwoData.testsPerOneMillion)})`
      },
    ]
    this.totalTestsAndPerMillionLabels = ["Test Per One Million (%)"]
    this.totalTestsAndPerMillionColors = [
      { backgroundColor: "rgb(153, 204, 204, 0.5)" },
      { backgroundColor: 'rgb(40, 167, 69, 0.5)' },
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
    
    this.notFoundErrorOne = null
    this.notFoundErrorTwo = null

    this.barChartCountryOneData = null
    this.barChartCountryTwoData = null

    this.linearChartCountryOneData = null
    this.linearChartCountryTwoData = null

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

    this.totalNewCasesData = []
    this.totalNewCasesLabels = []

    this.totalNewDeathsData = []
    this.totalNewDeathsLabels = []

    this.totalTestsAndPerMillionData = []
    this.totalTestsAndPerMillionLabels = []

    this.totalCasesandDeathsPerMillionData = []
    this.totalCasesandDeathsPerMillionLabels = []
  }

  // properties for bar charts only
  public barChartType = "bar";
  // All Cases Bar
  public barChartTotalCasesOptions = {
    legend: {
      position: "bottom"
    },
    tooltips: {
      borderWidth: 1,
      caretPadding: 15,
      displayColors: true,
      enabled: true,
      intersect: true,
      titleMarginBottom: 10,
      xPadding: 15,
      yPadding: 15,
      callbacks: {
        label: function (tooltipItems, data) {
          return data.datasets[tooltipItems.datasetIndex].label + ": " + tooltipItems.value + "%";
        }
      }
    },
    scales: {
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Total Positive Cases In World (%)'
          },
          ticks: {
            min: 0,
            max: 100,
            stepSize: 10,
            callback: function (value) { return value + "%" }
          },
          gridLines: {
            offsetGridLines: false
          }
        }
      ],
    },
    scaleShowVerticalLines: false,
    scaleShowDrawborder: false,
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      datalabels: {
        anchor: "end",
        clamp: true,
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: (value, ctx) => {
          // return " " + ((value / this.worldData.cases) * 100).toFixed(4) + "%\n Of world Cases"
          return value + "%";
        },
      },
    },
  };
  // deaths, and recovered bar
  public barChartOptions = {
    legend: {
      position: "bottom"
    },
    tooltips: {
      borderWidth: 1,
      caretPadding: 15,
      displayColors: true,
      enabled: true,
      intersect: true,
      titleMarginBottom: 10,
      xPadding: 15,
      yPadding: 15,
      callbacks: {
        label: function (tooltipItems, data) {
          return data.datasets[tooltipItems.datasetIndex].label + ": " + tooltipItems.value + "%";
        }
      }
    },
    scales: {
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Total Positive Cases In Each Country (%)'
          },
          ticks: {
            min: 0,
            max: 100,
            stepSize: 10,
            callback: function (value) { return value + "%" }
          },
          gridLines: {
            offsetGridLines: false
          }
        }
      ],
    },
    scaleShowVerticalLines: false,
    scaleShowDrawborder: false,
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      datalabels: {
        anchor: "end",
        clamp: true,
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: (value, ctx) => {
          return value + "%";
        },
      },
    },
  };
  // today cases bar
  public barChartTodayCasesOptions = {
    legend: {
      position: "bottom"
    },
    tooltips: {
      borderWidth: 1,
      caretPadding: 15,
      displayColors: true,
      enabled: true,
      intersect: true,
      titleMarginBottom: 10,
      xPadding: 15,
      yPadding: 15,
      callbacks: {
        label: function (tooltipItems, data) {
          return data.datasets[tooltipItems.datasetIndex].label + ": " + tooltipItems.value + "%";
        }
      }
    },
    scales: {
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Total Today/New Positive Cases In World (%)'
          },
          ticks: {
            min: 0,
            max: 100,
            stepSize: 10,
            callback: function (value) { return value + "%" }
          },
          gridLines: {
            offsetGridLines: false
          }
        }
      ],
    },
    scaleShowVerticalLines: false,
    scaleShowDrawborder: false,
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      datalabels: {
        anchor: "end",
        clamp: true,
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: (value, ctx) => {
          return value + "%";
        },
      },
    },
  };
  // today Deaths bar
  public barChartTodayDeathsOptions = {
    legend: {
      position: "bottom"
    },
    tooltips: {
      borderWidth: 1,
      caretPadding: 15,
      displayColors: true,
      enabled: true,
      intersect: true,
      titleMarginBottom: 10,
      xPadding: 15,
      yPadding: 15,
      callbacks: {
        label: function (tooltipItems, data) {
          return data.datasets[tooltipItems.datasetIndex].label + ": " + tooltipItems.value + "%";
        }
      }
    },
    scales: {
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Total Today/New Positive Cases In Each Country (%)'
          },
          ticks: {
            min: 0,
            max: 100,
            stepSize: 10,
            callback: function (value) { return value + "%" }
          },
          gridLines: {
            offsetGridLines: false
          }
        }
      ],
    },
    scaleShowVerticalLines: false,
    scaleShowDrawborder: false,
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      datalabels: {
        anchor: "end",
        clamp: true,
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: (value, ctx) => {
          return value + "%";
        },
      },
    },
  };
  // cases and deaths / one million bar chart options
  public barChartTotalCasesAndDeathsMillionOptionsAndTests = {
    legend: {
      position: "bottom"
    },
    tooltips: {
      borderWidth: 1,
      caretPadding: 15,
      displayColors: true,
      enabled: true,
      intersect: true,
      titleMarginBottom: 10,
      xPadding: 15,
      yPadding: 15,
      callbacks: {
        label: function (tooltipItems, data) {
          return data.datasets[tooltipItems.datasetIndex].label + ": " + tooltipItems.value + "%";
        }
      }
    },
    scales: {
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'One Million Population In A Country (%)'
          },
          ticks: {
            min: 0,
            max: 100,
            stepSize: 20,
            callback: function (value) { return value + "%" }
          },
          gridLines: {
            offsetGridLines: false
          }
        }
      ],
    },
    scaleShowVerticalLines: false,
    scaleShowDrawborder: false,
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      datalabels: {
        anchor: "end",
        clamp: true,
        font: {
          weight: 'bold',
          size: 12,
        },
        formatter: (value, ctx) => {
          return value + "%";
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
}
