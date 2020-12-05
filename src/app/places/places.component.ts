import { Component, OnInit } from '@angular/core';
import { PlaceInterface } from 'src/app/types/Place/place-interface';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})
export class PlacesComponent implements OnInit {
  places: PlaceInterface[];
  constructor() { }

  ngOnInit(): void {
  }

}
