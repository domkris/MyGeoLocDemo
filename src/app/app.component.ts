import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {} from 'googlemaps';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  places: any;
  url;
  latitude: number;
  longitude: number;
  constructor(private http: HttpClient){}
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
    const url = 'https://localhost:44311/places/search?location=43.5081,16.4402&radius=1500&type=restaurant&keyword=cruise';
    //const url = 'https://localhost:44311/places/search?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise';
    // this.url = 'https://localhost:44311/places/search?location=' + this.latitude + ',' + this.longitude + 
    // '&radius=1500&type=restaurant&keyword=cruise';
    const promise = this.http.get(url).toPromise();
    promise.then((data)=>{
      //console.log(data);
      this.places = data;
      console.log(this.places);

      this.places.forEach(place => {

        //console.log(typeof place.geometry.location.latitude);
        //console.log(typeof place.geometry.location.longitude);

        const pos = {
          lat: place.geometry.location.latitude,
          lng: place.geometry.location.longitude
        };
        //this.addMarker(pos);
        this.addMarkers(place);
      });
    })
  }
  onKey($event){
    this.searchPlace = $event.target.value;
    console.log(this.searchPlace);
  }
  addMarkers(place){
    var icon = {
      url: place.icon, // url
      scaledSize: new google.maps.Size(25, 25), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };
    const pos = {
      lat: place.geometry.location.latitude,
      lng: place.geometry.location.longitude
    };
    var marker = new google.maps.Marker({
      position: pos,
      map: this.map,
      draggable: true,
      icon: icon,
      animation: google.maps.Animation.DROP
    })
    var infoWindow = new google.maps.InfoWindow({
      content: '<h1>' +  place.name + '</h1> <h2>' +  place.vicinity + '</h2> '
    });
    var clicked = false;
    marker.addListener('click', ()=>{
      if(clicked){
        infoWindow.close();
      }else{
        infoWindow.open(this.map, marker);
      }
      clicked = !clicked;
    });
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
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
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
