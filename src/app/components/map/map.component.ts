import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {} from 'googlemaps';
import { GeoLocation } from 'src/app/types/GeoLocation/geolocation-interface';
import { Place } from 'src/app/types/Place/place-interface';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  map: google.maps.Map;
  mainMarker: google.maps.Marker;
  markers: google.maps.Marker[] = [];
  infoWindow: google.maps.InfoWindow;
  mainMarkerCircle: google.maps.Circle;
  location: GeoLocation;
  latLnglocation: string;
  @Output() getCurrentGeoLocation = new EventEmitter<string>();
  constructor() {}

  ngOnInit(): void {
    this.initMap();
  }
  /**
   * Creates an instance of map
   */
  initMap(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: Position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.map = new google.maps.Map(document.getElementById('map'), {
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            zoom: 15,
          });
          this.showMainMarker(pos);
          this.createMainMarkerCircle();
          this.latLnglocation =
            position.coords.latitude + ',' + position.coords.longitude;
          this.getGeoLocation();
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
  /**
   * Creates an instance of marker circle but does not show it on the map
   */
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
  /**
   * Change the position of  marker that indicates location  on the map
   */
  changeMainMarkerPosition(latLng: google.maps.LatLng): void {
    this.mainMarker.setPosition(latLng);
    this.map.setCenter(latLng);
  }
  /**
   * Show the marker that indicates location  on the map
   */
  showMainMarker(pos: { lat: number; lng: number }): void {
    this.mainMarker = new google.maps.Marker({
      position: pos,
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
    });

    google.maps.event.addListener(this.mainMarker, 'dragend', (event) =>
      this.onDraggingMainMarker(event)
    );
  }

  /**
   * @event
   * Fired everytime user drags the marker.
   * Recenters the map, circle and removes all markers for places on map.
   * Gets the new location.
   */
  onDraggingMainMarker(event: any): void {
    this.latLnglocation = event.latLng.lat() + ',' + event.latLng.lng();

    this.map.setCenter(this.mainMarker.getPosition());
    this.mainMarkerCircle.setCenter(this.mainMarker.getPosition());
    this.removePreviousMarkersFromMap();
    this.getGeoLocation();
  }
  /**
   * @event
   * calls a getGeoLocation method in MapContainerComponent to get location from ApiService
   */
  getGeoLocation() {
    this.getCurrentGeoLocation.emit(this.latLnglocation);
  }

  /**
   * Show the marker that indicates places on the map
   */
  showPlaceMarkersOnMap(places: Place[]) {
    this.removePreviousMarkersFromMap();
    this.mainMarkerCircle.setCenter(this.mainMarker.getPosition());
    places.forEach((place) => {
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
  /**
   * Create info windows for  all places
   * @param place
   */
  createInfoWindow(place: Place): google.maps.InfoWindow {
    return new google.maps.InfoWindow({
      content: '<h1>' + place.name + '</h1> <h2>' + place.vicinity + '</h2> ',
    });
  }
  /**
   * Show the markers of all places
   * @param place
   */
  createMarkerForPlace(place: Place): google.maps.Marker {
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
  /**
   * Removes all markers on the map
   */
  removePreviousMarkersFromMap(): void {
    if (this.markers.length != 0) {
      for (let i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
    }
  }
  addCircleToMap(radius: number) {
    this.mainMarkerCircle.setMap(this.map);
    this.mainMarkerCircle.setRadius(radius);
    this.mainMarkerCircle.setCenter(this.mainMarker.getPosition());
  }
  removeCircleFromMap() {
    this.mainMarkerCircle.setMap(null);
    this.mainMarkerCircle.setRadius(null);
    this.mainMarkerCircle.setCenter(null);
  }
}
