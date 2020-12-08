import { Component, OnInit, ViewChild } from '@angular/core';
import {} from 'googlemaps';
import { ApiService } from '../services/api.service';
import { PlaceInterface } from '../types/Place/place-interface';
import { GeoLocationInterface } from 'src/app/types/GeoLocation/geolocation-interface';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  location: GeoLocationInterface;
  latLnglocation: string;
  mainMarker: google.maps.Marker;
  mainMarkerCircle: google.maps.Circle;
  map: google.maps.Map;
  infoWindow: google.maps.InfoWindow;
  markers: google.maps.Marker[] = [];
  places: PlaceInterface[];

  @ViewChild(SearchComponent)
  private searchComponent: SearchComponent;
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
          this.createMainMarkerCircle();
          this.latLnglocation =
            position.coords.latitude + ',' + position.coords.longitude;

          // GET CURRENT GEOLOCATION OBJECT FROM API
          this.getCurrentGeoLocation();
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
  createMainMarkerCircle(): void {
    this.mainMarkerCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.6,
      strokeWeight: 1,
      fillColor: '#FF0000',
      fillOpacity: 0.08,
      map: this.map,
      center: null,
      radius: null,
    });
  }
  getPlaces(): void {
    this.places = null;
    if (this.searchComponent.isAddressManuallyTyped) {
      this.getNewLocationFromUsersAddress();
      this.searchComponent.isAddressManuallyTyped = false;
    } else {
      let location = this.searchComponent.location;
      let category = this.searchComponent.category;
      let radius = this.searchComponent.radius;
      let latLng =
        location.geometry.location.latitude +
        ',' +
        location.geometry.location.longitude;
      console.log(this.searchComponent.location);
      console.log(this.location);
      this.apiService
        .getPlaces(latLng, category, radius)
        .subscribe((places: PlaceInterface[]) => {
          this.places = places;
          console.log(places);
          this.showPlacesOnMap();
        });
    }
  }
  getNewLocationFromUsersAddress(): void {
    let address = this.searchComponent.formatedAddress;
    this.apiService
      .getLatLng(address)
      .subscribe((location: GeoLocationInterface) => {
        this.location = location;
        this.searchComponent.location = location;
        let latLng = new google.maps.LatLng(
          location.geometry.location.latitude,
          location.geometry.location.longitude
        );
        this.mainMarker.setPosition(latLng);
        this.map.setCenter(latLng);
        this.getPlaces();
        //console.log(location);
      });
    //console.log(address);
  }

  getCurrentGeoLocation(): void {
    this.apiService
      .getAddress(this.latLnglocation)
      .subscribe((location: GeoLocationInterface) => {
        this.location = location;
        this.searchComponent.location = location;
        if (this.searchComponent.searchByDraggingMainMarker) {
          this.getPlaces();
        }
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
  showCircleRadius(value: boolean): void {
    if (value) {
      this.mainMarkerCircle.setMap(this.map);
      this.mainMarkerCircle.setRadius(this.searchComponent.radius);
      this.mainMarkerCircle.setCenter(this.mainMarker.getPosition());
    } else {
      this.mainMarkerCircle.setMap(null);
      this.mainMarkerCircle.setRadius(null);
      this.mainMarkerCircle.setCenter(null);
    }
  }
  onDraggingMainMarker(event: any): void {
    this.latLnglocation = event.latLng.lat() + ',' + event.latLng.lng();
    // center the map as well
    //this.map.setCenter(this.mainMarker.getPosition());
    this.mainMarkerCircle.setCenter(this.mainMarker.getPosition());
    this.removePreviousMarkersFromMap();
    this.getCurrentGeoLocation();
  }

  handleLocationError(
    browserHasGeolocation: boolean,
    pos: google.maps.LatLng
  ): void {
    this.infoWindow.setPosition(pos);
    this.infoWindow.setContent(
      browserHasGeolocation
        ? 'Error: The Geolocation service failed.'
        : "Error: Your browser doesn't support geolocation."
    );
    this.infoWindow.open(this.map);
  }

  showPlacesOnMap(): void {
    this.removePreviousMarkersFromMap();
    this.mainMarkerCircle.setCenter(this.mainMarker.getPosition());
    this.places.forEach((place) => {
      //console.log(place);
      const marker = this.createMarkerForPlace(place);
      const infoWindow = this.createInfoWindow(place);
      this.addClickEventToMarker(marker, infoWindow);
    });
  }
  addClickEventToMarker(
    marker: google.maps.Marker,
    infoWindow: google.maps.InfoWindow
  ): void {
    var clicked = false;
    marker.addListener('click', () => {
      if (clicked) {
        infoWindow.close();
      } else {
        infoWindow.open(this.map, marker);
      }
      clicked = !clicked;
    });
  }
  createMarkerForPlace(place: PlaceInterface): google.maps.Marker {
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
    return marker;
  }
  createInfoWindow(place: PlaceInterface): google.maps.InfoWindow {
    return new google.maps.InfoWindow({
      content: '<h1>' + place.name + '</h1> <h2>' + place.vicinity + '</h2> ',
    });
  }
  removePreviousMarkersFromMap(): void {
    if (this.markers.length != 0) {
      for (let i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
    }
  }
}
