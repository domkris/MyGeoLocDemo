import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlaceInterface } from '../types/Place/place-interface';

@Injectable()
export class PlacesService {
  constructor(private http: HttpClient) {}
  miniUrl = new URL('https://localhost:44311/places/search/');
  url: string =
    'https://localhost:44311/places/search?location=43.5081,16.4402&radius=1500&type=restaurant&keyword=cruise';

  getPlaces(): Observable<PlaceInterface[]> {
    return this.http.get<PlaceInterface[]>(this.url);
  }
  getPlaces2(
    location: string,
    type: string,
    radius: number
  ): Observable<PlaceInterface[]> {
    this.miniUrl.searchParams.append('location', location);
    this.miniUrl.searchParams.append('type', type);
    this.miniUrl.searchParams.append('radius', radius.toString());
    return this.http.get<PlaceInterface[]>(this.miniUrl.toString());
  }
  getCurrentPlace(): void {
    console.log('YOU are here: TEST');
  }
}
