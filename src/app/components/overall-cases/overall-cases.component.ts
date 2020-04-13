import { Component, OnInit } from '@angular/core';
import { ManageApiService } from 'src/app/services/manage-api.service';

@Component({
  selector: 'app-overall-cases',
  templateUrl: './overall-cases.component.html',
  styleUrls: ['./overall-cases.component.scss']
})
export class OverallCasesComponent implements OnInit {
  overAllData: object = {};
  overAllDataLoading:boolean = true;
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
        console.log(error)
      }
    )
  }

}
