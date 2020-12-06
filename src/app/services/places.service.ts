import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddressInterface } from '../types/Address/address-interface';
import { PlaceInterface } from '../types/Place/place-interface';

@Injectable()
export class PlacesService {
  location: string;
  constructor(private http: HttpClient) {}

  getAddress(latlng: string): Observable<AddressInterface> {
    let url = new URL('https://localhost:44311/latlngtoaddress/search/');
    url.searchParams.append('latlng', latlng);
    return this.http.get<AddressInterface>(url.toString());
  }

  getLatLng() {}
  getPlaces(
    location: string,
    type: string,
    radius: number
  ): Observable<PlaceInterface[]> {
    let url = new URL('https://localhost:44311/places/search/');
    url.searchParams.append('location', location);
    url.searchParams.append('type', type);
    url.searchParams.append('radius', radius.toString());
    return this.http.get<PlaceInterface[]>(url.toString());
  }
  getCurrentPlace(): void {
    console.log('YOU are here: TEST');
  }
}
