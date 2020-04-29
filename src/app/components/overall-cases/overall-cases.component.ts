import { Component, OnInit } from '@angular/core';
import { ManageApiService } from 'src/app/services/manage-api.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as pluginDataLabels from "chartjs-plugin-datalabels";

// models
import { OverAll } from 'src/app/models/over-all';

@Component({
  selector: 'app-overall-cases',
  templateUrl: './overall-cases.component.html',
  styleUrls: ['./overall-cases.component.scss']
})
export class OverallCasesComponent implements OnInit {
  overAllData:OverAll[] = [];
  overAllHistoricalData: object = {};
  overAllDataLoading: boolean = true;
  overAllHistoricalDataLoading: boolean = true;
  overAllError: boolean = false;
  overAllHistoricalError: boolean = false;

  // All Cases historical
  public allCasesData: Array<any>;
  public allCasesLabels: Label[];
  public allCasesChartType: String;
  public allCasesChartColor: Color[];

  // All Recovered historical
  public allRecoveredData: Array<any>;
  public allRecoveredLabels: Label[];
  public allRecoveredChartType: String;
  public allRecoveredChartColor: Color[];

  // All Deaths historical
  public allDeathsData: Array<any>;
  public allDeathsLabels: Label[];
  public allDeathsChartType: String;
  public allDeathsChartColor: Color[];

  constructor(private apiService: ManageApiService) { }

  ngOnInit() {
    this.apiService.getOverAllData()
      .subscribe(
        data => {
          this.overAllData = data
          this.overAllDataLoading = false
        },
        error => {
          this.overAllDataLoading = false
          this.overAllError = true;
        }
      )

    this.apiService.getOverAllHistoricalData()
      .subscribe(
        data => {
          this.overAllHistoricalData = data;
          this.setAllCasesVisualization()
          this.setAllRecoveredCasesVisualization()
          this.setAllDeathCasesVisualization()
          this.overAllHistoricalDataLoading = false;
        },
        error => {
          this.overAllHistoricalDataLoading = false;
          this.overAllHistoricalError = true;
        }
      )

  }


  setAllCasesVisualization() {
    this.allCasesLabels = Object.keys(this.overAllHistoricalData['cases'])
    this.allCasesData = [
      { data: Object.values(this.overAllHistoricalData['cases']), label: 'Total Corona Virus Cases', fill: false }
    ];
    this.allCasesChartType = 'line'
    this.allCasesChartColor = [
      {
        borderColor: "rgb(153, 204, 204, 0.5)",
        pointBorderColor: "rgb(153, 204, 204, 0.5)",
        pointBackgroundColor: "rgb(153, 204, 204, 0.5)"
      }
    ]
  }

  setAllRecoveredCasesVisualization() {
    let recovered = this.overAllHistoricalData['recovered'];
    this.allRecoveredData = [
      { data: Object.values(recovered), label: "Total Corona Virus Recovered Cases", fill: false }
    ];
    this.allRecoveredLabels = Object.keys(recovered)
    this.allRecoveredChartType = "line"
    this.allRecoveredChartColor = [
      {
        borderColor: 'rgb(40, 167, 69, 0.5)',
        pointBorderColor: 'rgb(40, 167, 69, 0.5)',
        pointBackgroundColor: 'rgb(40, 167, 69, 0.5)'
      }
    ]
  }
  setAllDeathCasesVisualization() {
    let deaths = this.overAllHistoricalData['deaths'];
    this.allDeathsData = [
      { data: Object.values(deaths), label: "Total Corona Virus Death Cases", fill: false }
    ];
    this.allDeathsLabels = Object.keys(deaths)
    this.allDeathsChartType = "line"
    this.allDeathsChartColor = [
      {
        borderColor: 'rgb(220, 53, 69, 0.5)',
        pointBorderColor: 'rgb(220, 53, 69, 0.5)',
        pointBackgroundColor: 'rgb(220, 53, 69, 0.5)'
      }
    ]
  }

  public LineChartOptions = {
    scaleShowVerticalLines: false,
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      datalabels: {
        display: false
      },
    }
  };
  public legend = true;
  public linerChartPlugins = [pluginDataLabels]

  refresh() {
    this.ngOnInit()
    this.overAllError = false
    this.overAllDataLoading = true
    this.overAllHistoricalError = false
    this.overAllHistoricalDataLoading = true
  }

}
