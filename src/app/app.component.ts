import { Component } from '@angular/core';
import { PlatformLocation } from '@angular/common'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'covid19live';

  constructor(location: PlatformLocation) {
    location.onPopState(() => {
    
      // Array.from(document.getElementsByClassName("modal") as HTMLCollectionOf<HTMLElement>)[0].style.display = "none";
      if(document.getElementsByClassName("modal-backdrop")[0]){
        document.getElementsByClassName("modal-backdrop")[0].remove();
      }
      document.getElementsByTagName("BODY")[0].classList.remove("modal-open")
      // Array.from(document.getElementsByClassName("modal-backdrop") as HTMLCollectionOf<HTMLElement>)[0].style.display = "none";
      

  });
  }
  
}

