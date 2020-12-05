import { Component, OnInit } from '@angular/core';
import {} from 'googlemaps';
import { PlacesService } from '../services/places.service';
import { PlaceInterface } from '../types/Place/place-interface';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  showMarkers: boolean = false;
  searchPlace: string;
  currentLatitude: number;
  currentLongitude: number;
  currentLatLngMarker: google.maps.Marker;
  map: google.maps.Map;
  infoWindow: google.maps.InfoWindow;
  markers: google.maps.Marker[] = [];
  places: PlaceInterface[];
  constructor(private placesService: PlacesService) {}

  ngOnInit(): void {
    this.initMap();
    this.placesService.getPlaces().subscribe((places: PlaceInterface[]) => {
      this.places = places;
      this.places.forEach((place) => {
        console.log(place);
        //this.addMarker({ lat : place.geometry.location.latitude, lng : place.geometry.location.longitude})
      });
    });
  }
  initMap(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: Position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.map = new google.maps.Map(document.getElementById('map2'), {
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            zoom: 12,
          });
          this.addMarker(pos);
          this.currentLatitude = position.coords.latitude;
          this.currentLongitude = position.coords.longitude;
          console.log(
            'LAT: ' + this.currentLatitude + '  LNG: ' + this.currentLongitude
          );
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

  onKey($event) {
    this.searchPlace = $event.target.value;
    console.log(this.searchPlace);
  }
  addMarker(pos: { lat: number; lng: number }) {
    this.currentLatLngMarker = new google.maps.Marker({
      position: pos,
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
    });
    // getting-lat-lng-from-google-marker on DRAG
    google.maps.event.addListener(
      this.currentLatLngMarker,
      'dragend',
      (event) => {
        console.log('dd');
        this.currentLatitude = this.currentLatLngMarker.getPosition().lat();
        this.currentLongitude = this.currentLatLngMarker.getPosition().lng();

        // center the map as well
        this.map.setCenter(this.currentLatLngMarker.getPosition());
      }
    );
  }
  handleLocationError(browserHasGeolocation: boolean, pos: google.maps.LatLng) {
    this.infoWindow.setPosition(pos);
    this.infoWindow.setContent(
      browserHasGeolocation
        ? 'Error: The Geolocation service failed.'
        : "Error: Your browser doesn't support geolocation."
    );
    this.infoWindow.open(this.map);
  }
  findPlace(): void {
    this.showMarkers = false;
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    console.log('Find place KLIK');
  }
  showPlaces(): void {
    this.showMarkers = true;
    console.log('Show places KLIK');

    this.places.forEach((place) => {
      var icon = {
        url: place.icon, // url
        scaledSize: new google.maps.Size(25, 25), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0), // anchor
      };

      const pos = {
        lat: place.geometry.location.latitude,
        lng: place.geometry.location.longitude,
      };

      const marker = new google.maps.Marker({
        position: pos,
        map: this.map,
        draggable: true,
        icon: icon,
        animation: google.maps.Animation.DROP,
      });
      this.markers.push(marker);

      var infoWindow = new google.maps.InfoWindow({
        content: '<h1>' + place.name + '</h1> <h2>' + place.vicinity + '</h2> ',
      });

      var clicked = false;
      marker.addListener('click', () => {
        if (clicked) {
          infoWindow.close();
        } else {
          infoWindow.open(this.map, marker);
        }
        clicked = !clicked;
      });
    });
  }
}
