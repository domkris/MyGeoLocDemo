import { Component, OnInit } from '@angular/core';
import {} from 'googlemaps';
import { ApiService } from '../services/api.service';
import { PlaceInterface } from '../types/Place/place-interface';
import { AddressInterface } from '../types/Address/address-interface';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  address: AddressInterface;
  latLnglocation: string;
  mainMarker: google.maps.Marker;
  map: google.maps.Map;
  infoWindow: google.maps.InfoWindow;
  markers: google.maps.Marker[] = [];
  places: PlaceInterface[];
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.initMap();
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
            zoom: 13,
          });
          // DRAW THE MARKER  OF CURRENT LOCATION ON THE MAP
          this.showMainMarker(pos);
          this.latLnglocation =
            position.coords.latitude + ',' + position.coords.longitude;

          // GET CURRENT ADDRESS OBJECT FROM API
          this.getCurrentAddress();
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
  searchPlaces(params: {
    location: AddressInterface;
    category: string;
    radius: number;
  }): void {
    console.log(params);
    let latLng =
      params.location.geometry.location.latitude +
      ',' +
      params.location.geometry.location.longitude;
    this.apiService
      .getPlaces(latLng, params.category, params.radius)
      .subscribe((places: PlaceInterface[]) => {
        this.places = places;
        console.log(places);
        this.showPlaces();
      });
  }

  getCurrentAddress(): void {
    this.apiService
      .getAddress(this.latLnglocation)
      .subscribe((address: AddressInterface) => {
        this.address = address;
      });
  }

  showMainMarker(pos: { lat: number; lng: number }): void {
    this.mainMarker = new google.maps.Marker({
      position: pos,
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
    });

    // getting-lat-lng-from-google-marker on DRAG
    google.maps.event.addListener(this.mainMarker, 'dragend', (event) =>
      this.onDraggingMainMarker(event)
    );
  }

  onDraggingMainMarker(event: any): void {
    this.latLnglocation = event.latLng.lat() + ',' + event.latLng.lng();

    // center the map as well
    //this.map.setCenter(this.mainMarker.getPosition());
    this.places = null;
    this.removePreviousMarkersFromMap();
    this.getCurrentAddress();
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

  showPlaces(): void {
    if (this.markers.length != 0) {
      this.removePreviousMarkersFromMap();
    }
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
  removePreviousMarkersFromMap(): void {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
  }
}
