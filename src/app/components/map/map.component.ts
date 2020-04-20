import { Component, OnInit } from '@angular/core';
import * as mapboxgl from "mapbox-gl";
import { environment } from 'src/environments/environment';
import { ManageApiService } from 'src/app/services/manage-api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor(
    private apiService: ManageApiService,
    private datePipe: DatePipe
  ) { }

  data: any = [];
  map: mapboxgl.Map;
  marker: mapboxgl.Marker;
  geojson;
  loading: boolean = true
  error: boolean = false

  ngOnInit() {
    var map = this.map;

    // load All data
    this.apiService.getAllCountriesData().subscribe(
      data => {
        this.data = data;
        // data for visulaizing
        this.geojson = {
          'type': 'FeatureCollection',
          'features': this.data
        };
        // add markers to map
        this.geojson.features.forEach(function (marker) {
          // create a DOM element for the marker
          var el = document.createElement('div');
          el.className = 'marker';
          var popup = new mapboxgl.Popup({ offset: 10 })
            .setLngLat([marker['countryInfo'].long, marker['countryInfo'].lat])
            .setHTML(
              `
                  <h1>${marker.country}</h1>
                  <div class="dropdown-divider"></div>
                  <div class="text-center">
                    <strong>Total Cases:</strong> <span class='text-info'>${numberWithCommas(marker.cases)} </span>
                  </div>
                  <div class='dropdown-divider'></div>
                  <div class="row text-center">
                    <div class="col-7">
                       <strong>Recovered:</strong> 
                       <span class='text-success  d-block'>${numberWithCommas(marker.recovered)} </span>
                    </div>
                    <div class="col-5">
                        <strong>Deaths:</strong> 
                        <span class='text-danger d-block'>${numberWithCommas(marker.deaths)}</span> 
                    </div>
                  </div>
                  <div class='dropdown-divider'></div>
                  <div class="row text-center">
                    <div class="col-7">
                      <strong>Active:</strong> 
                      <span class=' d-block'>${numberWithCommas(marker.active)} </span>
                    </div>
                    <div class="col-5">
                       <strong>Critical:</strong> 
                       <span class='text-danger d-block'>${numberWithCommas(marker.critical)}</span> 
                    </div>
                  </div>
                  <div class='dropdown-divider'></div>
                  <div class="row text-center">
                    <div class="col-7">
                      <strong>New Cases:</strong> 
                      <span class='text-info d-block'>${numberWithCommas(marker.todayCases)} </span>
                    </div>
                    <div class="col-5">
                       <strong>New Deaths:</strong> 
                       <span class='text-danger d-block'>${numberWithCommas(marker.todayDeaths)}</span> 
                    </div>
                  </div>
                  <div class='dropdown-divider'></div>
                  <div class="row text-center">
                    <div class="col-12">
                      <strong>Deaths Per One Million:</strong> 
                      <span class='text-info d-block'>${numberWithCommas(marker.deathsPerOneMillion)} </span>
                    </div>
                  </div>
                  <div class='dropdown-divider'></div>
                  <div class="row text-center">
                    <div class="col-12">
                      <strong>Over All Tests:</strong> 
                      <span class='text-info d-block'>${numberWithCommas(marker.tests)} </span>
                    </div>
                  </div>
                  <div class='dropdown-divider'></div>
                  <div class="row text-center">
                    <div class="col-12">
                      <strong>Tests Per One Million:</strong> 
                      <span class='text-info d-block'>${numberWithCommas(marker.testsPerOneMillion)} </span>
                    </div>
                  </div>
                  `
            );

          // add marker to map
          new mapboxgl.Marker(el)
            .setLngLat([marker['countryInfo'].long, marker['countryInfo'].lat])
            .setPopup(popup)
            .addTo(map);
        });
      },
      error => {
        this.loading = false
        this.error = true
      }
    )


    // get the access token for the mapbox
    Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set(environment.mapboxKey);
    map = new mapboxgl.Map({
      container: "map",
      style: 'mapbox://styles/mapbox/outdoors-v11',
      zoom: 3,
      center: [0, 0],
    });


    // ENABLE USER TRAKING SYSTEM
    var currentLocation = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    });
    // add the geoloation to control
    map.addControl(currentLocation);
    // GET THE CURRENT USER COORDINATES
    currentLocation.on('geolocate', function (e) {
      var lon = e.coords.longitude;
      var lat = e.coords.latitude
      var position = [lon, lat];
      // console.log(position);
    });

    // add navigation control to the map
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.FullscreenControl());

    map.on("load", () => {
      this.loading = false;
    })
  }

  refresh() {
    this.ngOnInit()
    this.error = false
    this.loading = true
  }



}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}