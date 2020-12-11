import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeoLocation } from '../types/GeoLocation/geolocation-interface';
import { Place } from '../types/Place/place-interface';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {}

  getAddress(latlng: string): Observable<GeoLocation> {
    let url = new URL('https://localhost:44311/address/');
    url.searchParams.append('latlng', latlng);
    return this.http.get<GeoLocation>(url.toString());
  }

  getLatLng(address: string): Observable<GeoLocation> {
    let url = new URL('https://localhost:44311/latlng/');
    url.searchParams.append('address', address);
    return this.http.get<GeoLocation>(url.toString());
  }
  getPlaces(
    location: string,
    type: string,
    radius: number
  ): Observable<Place[]> {
    let url = new URL('https://localhost:44311/places/');
    url.searchParams.append('location', location);
    url.searchParams.append('type', type);
    url.searchParams.append('radius', radius.toString());
    return this.http.get<Place[]>(url.toString());
  }
}
