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
  infoWindow: google.maps.InfoWindow;
  searchPlace;
  handleLocationError(
    browserHasGeolocation: boolean,
    pos: google.maps.LatLng
  ) {
    this.infoWindow.setPosition(pos);
    this.infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    this.infoWindow.open(this.map);
  }
  findPlaces(){

  }
  onKey($event){
    this.searchPlace = $event.target.value;
    console.log(this.searchPlace);
  }
  addMarker(coords){
    var marker = new google.maps.Marker({
      position: coords,
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP
    })
  }

  initMap(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: Position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: position.coords.latitude, lng: position.coords.longitude },
            zoom: 12,
          });
          this.addMarker(pos);
        },
        () => {
          this.handleLocationError(true, this.map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      this.handleLocationError(false, this.map.getCenter());
    }
  }
}
