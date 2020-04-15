import { Component, OnInit } from '@angular/core';
import { ManageApiService } from 'src/app/services/manage-api.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-overall-cases',
  templateUrl: './overall-cases.component.html',
  styleUrls: ['./overall-cases.component.scss']
})
export class OverallCasesComponent implements OnInit {
  overAllData: object = {};
  overAllHistoricalData: object = {};
  overAllDataLoading:boolean = true;
  overAllHistoricalDataLoading:boolean = true;
  overAllError:boolean = false;
  overAllHistoricalError:boolean = false;

  // All Cases historical
  public allCasesData:Array<any>;
  public allCasesLabels:Label[];
  public allCasesChartType:String;
  public allCasesChartColor:Color[];

  // All Recovered historical
  public allRecoveredData:Array<any>;
  public allRecoveredLabels:Label[];
  public allRecoveredChartType:String;
  public allRecoveredChartColor:Color[];

   // All Deaths historical
   public allDeathsData:Array<any>;
   public allDeathsLabels:Label[];
   public allDeathsChartType:String;
   public allDeathsChartColor:Color[];
   
  constructor(private apiService:ManageApiService) { }

  ngOnInit() {
    this.apiService.getOverAllData()
    .subscribe(
      data => {
        this.overAllData = data
        this.overAllDataLoading = false
      },
      error => {
        this.overAllDataLoading = false
        this.overAllError =true;
      }
    )

    this.apiService.getOverAllHistoricalData()
      .subscribe(
        data =>{
          this.overAllHistoricalData = data;
          this.setAllCasesVisualization()
          this.setAllRecoveredCasesVisualization()
          this.setAllDeathCasesVisualization()
          this.overAllHistoricalDataLoading = false;         
        },
        error=>{
          this.overAllHistoricalDataLoading = false;
          this.overAllHistoricalError = true;
        }
      )

  }


  setAllCasesVisualization(){
    this.allCasesLabels = Object.keys(this.overAllHistoricalData['cases'])
    this.allCasesData = [
      {data:Object.values(this.overAllHistoricalData['cases']), label:'Total Corona Virus Cases'}
    ];
    this.allCasesChartType = 'line'
    this.allCasesChartColor = [
      {backgroundColor:'rgb(153, 204, 204, 0.5)'},
    ]
  }

  setAllRecoveredCasesVisualization(){
    let recovered = this.overAllHistoricalData['recovered']; 
    this.allRecoveredData = [
      {data:Object.values(recovered), label:"Total Corona Virus Recovered Cases"}
    ];
    this.allRecoveredLabels = Object.keys(recovered)
    this.allRecoveredChartType = "line"
    this.allRecoveredChartColor = [
      {backgroundColor:'rgb(40, 167, 69, 0.5)'}
    ]
  }
  setAllDeathCasesVisualization(){
    let deaths = this.overAllHistoricalData['deaths'];
    this.allDeathsData = [
      {data:Object.values(deaths), label:"Total Corona Virus Death Cases"}
    ];
    this.allDeathsLabels = Object.keys(deaths)
    this.allDeathsChartType = "line"
    this.allDeathsChartColor = [
      {backgroundColor:'rgb(220, 53, 69, 0.5)'}
    ]
  }
  

  // public data = [
  //   // {data:[12,14,15,17],label:'Afghanistan Income'},
  //   {data:[90,8,1200,20],label:'India Income'}
  // ];
 
  public options = {
    scaleShowVerticalLines: false,
    maintainAspectRatio: false,
    responsive: true,
  };
  public legend=true;


}
