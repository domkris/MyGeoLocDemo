import { Component, OnInit } from '@angular/core';
import {} from 'googlemaps';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  ngOnInit(): void {
    this.initMap()
  }
  title = 'MyGeoLocDemo';
  map;
  initMap(): void {
    this.map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 42.397, lng: -70 },
      zoom: 8,
    });
  }
}
