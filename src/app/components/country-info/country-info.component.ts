import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import { ManageApiService } from 'src/app/services/manage-api.service';
@Component({
  selector: 'app-country-info',
  templateUrl: './country-info.component.html',
  styleUrls: ['./country-info.component.scss']
})
export class CountryInfoComponent implements OnInit {
  country: string = null;
  countryData: any = {};
  allDataLoading:boolean = true
  overAllError:boolean = false
  notFoundError:boolean = false
  // active cases charts properties
  public activeData: ChartDataSets[];
  public activeLabels: Label[];
  public activeColors: Color[];

  // active closed charts properties
  public closedData: ChartDataSets[];
  public closedLabels: Label[];
  public closedColors: Color[];

  // today cases charts properties
  public todayData: ChartDataSets[];
  public todayLabels: Label[];
  public todayColors: Color[];

  constructor(
    private route: ActivatedRoute,
    private apiService: ManageApiService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.country = params.get("country");
    })

    this.apiService.getCountryData(this.country).subscribe
      (
        data => {
          this.countryData = data
          this.setActiveCasesVisualization()
          this.setClosedCasesVisualization()
          this.setTodayCasesVisualization()
          this.allDataLoading = false
        },
        error => {
          this.allDataLoading = false
          if(error.status === 404){
            this.notFoundError = true;
          }else{
            this.overAllError = true
          }
        }
      )
  }

  // charts of overall cases for a country
  public casesChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      position: "bottom"
    },
    plugins: {
      datalabels: {
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: (value, ctx) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;
          dataArr.map(data => {
            sum += data;
          });
          let percentage = (value * 100 / sum).toFixed(2) + "%";
          return percentage;
        },
      },
    },
  
  };
  public casesChartPlugin = [pluginDataLabels]
  public casesChartLegend = true;
  public casesChartColors = [
    { backgroundColor: ['rgb(153, 204, 204, 0.7)', 'rgb(220, 53, 69, 0.5)'] }
  ]
  public casesChartType = "pie"

  setActiveCasesVisualization() {
    // set data
    this.activeData = [
      { data: [(this.countryData['active'] - this.countryData['critical']), this.countryData['critical']] }
    ];
    // set labels
    this.activeLabels = ["Normal Condition Cases", "Critical Condition Cases"];
  }

  setClosedCasesVisualization() {
    // set data
    this.closedData = [
      { data: [this.countryData['recovered'], this.countryData['deaths']] }
    ];
    // set labels
    this.closedLabels = ["Recovered Cases", "Deaths Cases"];
  }

  setTodayCasesVisualization() {
    // set data
    this.todayData = [
      { data: [(this.countryData['todayCases'] - this.countryData['todayDeaths']), this.countryData['todayDeaths']] }
    ];
    // set labels
    this.todayLabels = ["Normal / critical / recovered Cases", "Deaths Cases"];
  }



  
  refresh() {
    this.ngOnInit()
    this.overAllError = false
    this.allDataLoading = true
  }

}
