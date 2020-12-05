import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlaceInterface } from '../types/Place/place-interface';

@Injectable()
export class PlacesService{
    constructor( private http: HttpClient){
    }
    url: string = 'https://localhost:44311/places/search?location=43.5081,16.4402&radius=1500&type=restaurant&keyword=cruise';
    
    getPlaces(): Observable<PlaceInterface[]>{
        return this.http.get<PlaceInterface[]>(this.url)
    }
    getCurrentPlace(): void{
        console.log("YOU are here: TEST");
    }
}