import { Component, OnInit } from '@angular/core';
import {} from 'googlemaps';
import { PlacesService } from '../services/places.service';
import { PlaceInterface } from '../types/Place/place-interface';
import { items } from 'src/app/types/types-constants';
import { AddressInterface } from '../types/Address/address-interface';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  addressFormated: string;
  address: AddressInterface;
  items = items;
  types = DataTransferItemList;
  radius: number = 1000;
  location: string;
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
          this.addcurrentLatLngMarker(pos);
          this.currentLatitude = position.coords.latitude;
          this.currentLongitude = position.coords.longitude;
          this.location = this.currentLatitude + ',' + this.currentLongitude;
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

  getCurrentPlaces(location: string) {
    this.places = [];
    this.placesService
      .getPlaces(this.location, 'restaurant', this.radius)
      .subscribe((places: PlaceInterface[]) => {
        this.places = places;
        this.showPlaces();
      });
  }
  getCurrentAddress() {
    this.placesService
      .getAddress(this.location)
      .subscribe((address: AddressInterface) => {
        this.address = address;
        this.formatAddress();
        console.log(this.address.addressComponents);
      });
  }
  formatAddress() {
    let addressComponentsLength: number = this.address.addressComponents.length;
    switch (addressComponentsLength) {
      case 9:
        this.addressFormated =
          this.address.addressComponents[0].longName +
          ', ' +
          this.address.addressComponents[1].longName +
          ', ' +
          this.address.addressComponents[2].longName +
          ', ' +
          this.address.addressComponents[3].longName +
          ', ' +
          this.address.addressComponents[5].longName +
          ', ' +
          this.address.addressComponents[6].longName;
        break;
      case 8:
        this.addressFormated =
          this.address.addressComponents[0].longName +
          ', ' +
          this.address.addressComponents[1].longName +
          ', ' +
          this.address.addressComponents[2].longName +
          ', ' +
          this.address.addressComponents[3].longName +
          ', ' +
          this.address.addressComponents[6].longName;
        break;
      case 7:
        this.addressFormated =
          this.address.addressComponents[0].longName +
          ', ' +
          this.address.addressComponents[1].longName +
          ', ' +
          this.address.addressComponents[2].longName +
          ', ' +
          this.address.addressComponents[5].longName;
        break;
      case 6:
        this.addressFormated =
          this.address.addressComponents[0].longName +
          ', ' +
          this.address.addressComponents[1].longName +
          ', ' +
          this.address.addressComponents[2].longName +
          ', ' +
          this.address.addressComponents[4].longName;
        break;
      case 5:
        this.addressFormated =
          this.address.addressComponents[0].longName +
          ', ' +
          this.address.addressComponents[1].longName +
          ', ' +
          this.address.addressComponents[2].longName +
          ', ' +
          this.getCountry();
        break;
      case 4:
        this.addressFormated =
          this.address.addressComponents[0].longName +
          ', ' +
          this.address.addressComponents[1].longName +
          ', ' +
          this.address.addressComponents[3].longName;
        break;
      case 3:
        this.addressFormated =
          this.address.addressComponents[0].longName +
          ', ' +
          this.address.addressComponents[1].longName +
          ', ' +
          this.address.addressComponents[2].longName;
        break;
      case 2:
        this.addressFormated =
          this.address.addressComponents[0].longName +
          ', ' +
          this.address.addressComponents[1].longName;
        break;
      case 1:
        this.addressFormated =
          this.address.addressComponents[0].longName +
          ', ' +
          this.address.addressComponents[1].longName;
        break;
        break;
    }
  }
  getCountry(): string {
    return this.address.addressComponents[3].types.includes('country')
      ? this.address.addressComponents[3].longName
      : this.address.addressComponents[4].longName;
  }
  onKeyRadius($event) {
    this.radius = $event.target.value;
  }
  onKeyAddress($event) {
    console.log('Nismo jos napravili');
  }
  addcurrentLatLngMarker(pos: { lat: number; lng: number }) {
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
      (event) => this.currentLatLngMarkerOnDrag(event)
    );
  }

  currentLatLngMarkerOnDrag(event: any) {
    this.currentLatitude = event.latLng.lat();
    this.currentLongitude = event.latLng.lng();
    this.location = this.currentLatitude + ',' + this.currentLongitude;

    // center the map as well
    this.map.setCenter(this.currentLatLngMarker.getPosition());

    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.getCurrentPlaces(this.location);
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
