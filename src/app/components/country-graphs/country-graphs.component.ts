import { Component, OnInit, Input } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import { ManageApiService } from 'src/app/services/manage-api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-country-graphs',
  templateUrl: './country-graphs.component.html',
  styleUrls: ['./country-graphs.component.scss']
})
export class CountryGraphsComponent implements OnInit {
  @Input() country: String;
  countryHistoricalData: any = {}

  // Total country cases grpah properties
  public totalCasesData: Array<any>;
  public totalCasesLabel: Label[] = [];
  public totalCasesColors: Color[];
  public totalCasesType: string;

  // Total country Death cases grpah properties
  public totalDeathCasesData: Array<any>;
  public totalDeathCasesLabel: Label[] = [];
  public totalDeathCasesColors: Color[];
  public totalDeathCasesType: string;

  // Total country Death cases grpah properties
  public totalRecoveredCasesData: Array<any>;
  public totalRecoveredCasesLabel: Label[] = [];
  public totalRecoveredCasesColors: Color[];
  public totalRecoveredCasesType: string;

  // Total country Death cases grpah properties
  public compareCasesData: Array<any>;
  public compareCasesLabel: Label[] = [];
  public compareCasesColors: Color[];
  public compareCasesType: string;

  constructor(
    private apiService: ManageApiService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.apiService.getCountryHistoricalData(this.country).subscribe
      (
        data => {
          this.countryHistoricalData = data
          this.setTotalCasesChartData()
          this.setDeathCasesChartData()
          this.setRecoveredCasesChartData()
          this.setCompareCasesChartData()
        },
        error => {
          console.log(error)
        }
      )
  }

  transformDate(date) {
    return this.datePipe.transform(date, 'MMM d')
  }

  public casesChartOptions = {
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

  public casesChartPlugin = [pluginDataLabels];
  public casesChartLegend = "true";

  setTotalCasesChartData() {
    let totalCases = this.countryHistoricalData['timeline'].cases;
    this.totalCasesData = [
      { data: Object.values(totalCases), label: "Total Cases", fill: true }
    ];
    for (var key in Object.keys(totalCases)) {
      this.totalCasesLabel.push(this.transformDate(Object.keys(totalCases)[key]))
    }
    this.totalCasesType = "line";
    this.totalCasesColors = [
      {
        borderColor: "rgb(153, 204, 204, 0.5)",
        pointBorderColor: "rgb(153, 204, 204, 0.5)",
        pointBackgroundColor: "rgb(153, 204, 204, 0.5)",
        backgroundColor: "rgb(153, 204, 204, 0.1)"
      }
    ];
  }

  setDeathCasesChartData() {
    let deathCases = this.countryHistoricalData['timeline'].deaths;
    this.totalDeathCasesData = [
      { data: Object.values(deathCases), label: "Total Death Cases", fill: false }
    ];
    for (var key in Object.keys(deathCases)) {
      this.totalDeathCasesLabel.push(this.transformDate(Object.keys(deathCases)[key]))
    }
    this.totalDeathCasesType = "bar";
    this.totalDeathCasesColors = [
      {
        hoverBackgroundColor: "rgb(220, 53, 69,0.5)",
      }
    ];
  }

  setRecoveredCasesChartData() {
    let recoveredCases = this.countryHistoricalData['timeline'].recovered;
    this.totalRecoveredCasesData = [
      { data: Object.values(recoveredCases), label: "Total Death Cases", fill: false }
    ];
    for (var key in Object.keys(recoveredCases)) {
      this.totalRecoveredCasesLabel.push(this.transformDate(Object.keys(recoveredCases)[key]))
    }
    this.totalRecoveredCasesType = "bar";
    this.totalRecoveredCasesColors = [
      {
        backgroundColor: "rgb(40, 167, 69,0.2)",
        hoverBackgroundColor: "rgb(40, 167, 69,0.7)",
      }
    ];
  }

  setCompareCasesChartData() {
    let allCases = this.countryHistoricalData['timeline'].cases;
    let deathCases = this.countryHistoricalData['timeline'].deaths;
    let recoveredCases = this.countryHistoricalData['timeline'].recovered;
    this.compareCasesData = [
      { data: Object.values(allCases), label: "Total Cases", fill: true },
      { data: Object.values(deathCases), label: "Total Death Cases", fill: true },
      { data: Object.values(recoveredCases), label: "Total Recovered Cases", fill: true }
    ];
    for (var key in Object.keys(allCases)) {
      this.compareCasesLabel.push(this.transformDate(Object.keys(allCases)[key]))
    }

    this.compareCasesType = "bar";
    this.compareCasesColors = [
      {
        backgroundColor: "rgb(153, 204, 204, 0.5)",
        hoverBackgroundColor: "rgb(153, 204, 204, 0.9)"
      },
      {
        backgroundColor: 'rgb(220, 53, 69, 0.5)',
        hoverBackgroundColor: "rgb(220, 53, 69,0.9)",
      },
      {
        backgroundColor: 'rgb(40, 167, 69, 0.5)',
        hoverBackgroundColor: 'rgb(40, 167, 69, 0.9)',
      },
    ];
  }

  // change compare chart type
  changeCharType(type, event, nextBtn) {
    if (type === "line") {
      this.compareCasesType = "line"
      this.compareCasesColors = [
        {
          borderColor: "rgb(153, 204, 204, 0.5)",
          pointBorderColor: "rgb(153, 204, 204, 0.5)",
          pointBackgroundColor: "rgb(153, 204, 204, 0.5)",
          backgroundColor: "rgb(153, 204, 204, 0.1)"
        },
        {
          borderColor: 'rgb(220, 53, 69, 0.3)',
          pointBorderColor: 'rgb(220, 53, 69, 0.3)',
          pointBackgroundColor: 'rgb(220, 53, 69, 0.3)',
          backgroundColor: 'rgb(220, 53, 69, 0.2)',
        },
        {
          borderColor: 'rgb(40, 167, 69, 0.3)',
          pointBorderColor: 'rgb(40, 167, 69, 0.3)',
          pointBackgroundColor: 'rgb(40, 167, 69, 0.3)',
          backgroundColor: 'rgb(40, 167, 69, 0.2)',
        },
      ];
    } else {
      this.compareCasesType = "bar"
      this.compareCasesColors = [
        {
          backgroundColor: "rgb(153, 204, 204, 0.5)",
          hoverBackgroundColor: "rgb(153, 204, 204, 0.9)"
        },
        {
          backgroundColor: 'rgb(220, 53, 69, 0.5)',
          hoverBackgroundColor: "rgb(220, 53, 69,0.9)",
        },
        {
          backgroundColor: 'rgb(40, 167, 69, 0.5)',
          hoverBackgroundColor: 'rgb(40, 167, 69, 0.9)',
        },
      ];
    }
    event.target.className += " active"
    nextBtn.className = nextBtn.className.replace("active", " ")
  }

}
