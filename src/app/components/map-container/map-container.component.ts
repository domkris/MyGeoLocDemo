import { Component, OnInit, ViewChild } from '@angular/core';
import {} from 'googlemaps';
import { ApiService } from '../../services/api.service';
import { Place } from '../../types/Place/place-interface';
import { GeoLocation } from 'src/app/types/GeoLocation/geolocation-interface';
import { SearchComponent } from '../search/search.component';
import { MapComponent } from '../map/map.component';
import { NgProgressComponent } from 'ngx-progressbar';

@Component({
  selector: 'app-map-container',
  templateUrl: './map-container.component.html',
  styleUrls: ['./map-container.component.css'],
})
export class MapContainerComponent implements OnInit {
  mainMarkerCircle: google.maps.Circle;
  map: google.maps.Map;
  location: GeoLocation;
  infoWindow: google.maps.InfoWindow;
  markers: google.maps.Marker[] = [];
  places: Place[];

  @ViewChild(NgProgressComponent) progressBar: NgProgressComponent;
  @ViewChild(SearchComponent) private searchComponent: SearchComponent;
  @ViewChild(MapComponent)
  private mapComponent: MapComponent;
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {}

  getPlaces(): void {
    this.progressBar.start();
    this.places = null;
    if (this.searchComponent.isAddressManuallyTyped) {
      this.getNewAddress();
      this.searchComponent.isAddressManuallyTyped = false;
      this.progressBar.complete();
    } else {
      let location = this.location;
      let category = this.searchComponent.category;
      let radius = this.searchComponent.radius;
      let latLng =
        location.geometry.location.latitude +
        ',' +
        location.geometry.location.longitude;
      this.apiService
        .getPlaces(latLng, category, radius)
        .subscribe((places: Place[]) => {
          this.places = places;
          this.showPlacesOnMap();
          this.progressBar.complete();
        });
    }
  }
  getNewAddress(): void {
    let address = this.searchComponent.formatedAddress;
    this.apiService.getLatLng(address).subscribe((location: GeoLocation) => {
      if (location != null) {
        this.location = location;
        let latLng = new google.maps.LatLng(
          location.geometry.location.latitude,
          location.geometry.location.longitude
        );
        this.mapComponent.changeMainMarkerPosition(latLng);
        this.getPlaces();
      } else {
        alert('Address unknown');
      }
    });
  }

  getCurrentGeoLocation(latLng: string): void {
    this.apiService.getAddress(latLng).subscribe((location: GeoLocation) => {
      this.location = location;
      if (this.searchComponent.searchByDraggingMainMarker) {
        this.getPlaces();
      }
    });
  }

  radiusSizeChange(value: number): void {
    this.mapComponent.mainMarkerCircle.setRadius(value);
  }
  showCircleRadius(value: boolean): void {
    if (value) {
      this.mapComponent.addCircleToMap(this.searchComponent.radius);
    } else {
      this.mapComponent.removeCircleFromMap();
    }
  }

  showPlacesOnMap(): void {
    this.mapComponent.showPlaceMarkersOnMap(this.places);
  }
}
