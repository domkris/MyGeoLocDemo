import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChange,
} from '@angular/core';
import { items } from 'src/app/types/types-constants';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { GeoLocationInterface } from 'src/app/types/GeoLocation/geolocation-interface';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  isAddressManuallyTyped: boolean;
  items = items;
  radius: number;
  radiusDefault: number = 1000;
  category: string;
  categoryDefaultId: number;
  formatedAddress: string;
  searchByDraggingMainMarker: boolean;
  showMainMarkerCircle: boolean;

  @Input() location: GeoLocationInterface;
  @Output() searchPlacesEvent = new EventEmitter();
  @Output() radiusSizeChangeEvent = new EventEmitter<number>();
  @Output() mainMarkerCircleStatusChange = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit(): void {
    this.categoryDefaultId = items.find((item) => item.name == 'restaurant').id;
    this.category = items.find(
      (item) => item.id == this.categoryDefaultId
    ).name;
    this.radius = this.radiusDefault;
    this.searchByDraggingMainMarker = false;
    this.isAddressManuallyTyped = false;
    this.showMainMarkerCircle = false;
  }
  ngOnChanges(changes: SimpleChange): void {
    if (changes['location'].currentValue) {
      console.log(
        'ngOnChange SearchComponent Address',
        changes['location'].currentValue
      );
      this.location = changes['location'].currentValue;
      this.formatAddress();
    }
  }
  toggleSearchWithMarkerDraggingSelection(value: boolean): void {
    this.searchByDraggingMainMarker = value;
  }
  toggleShowMarkerCircleSelection(value: boolean): void {
    console.log(value);
    this.showMainMarkerCircle = value;
    this.mainMarkerCircleStatusChange.emit(value);
  }

  onKeyAddress($event: Event): void {
    this.formatedAddress = ($event.target as HTMLInputElement).value;
    this.isAddressManuallyTyped = true;
  }
  onValueSelected(id: number): void {
    this.category = items.find((item) => item.id == id).name;
  }

  onKeyRadius($event: Event): void {
    this.radius = parseInt(($event.target as HTMLInputElement).value);
    if (!Number.isNaN(this.radius)) {
      this.radiusSizeChangeEvent.emit(this.radius);
    }
  }
  formatAddress(): void {
    let addressComponentsLength: number = this.location.addressComponents
      .length;
    switch (addressComponentsLength) {
      case 9:
        this.formatedAddress =
          this.location.addressComponents[0].longName +
          ', ' +
          this.location.addressComponents[1].longName +
          ', ' +
          this.location.addressComponents[2].longName +
          ', ' +
          this.location.addressComponents[3].longName +
          ', ' +
          this.location.addressComponents[5].longName +
          ', ' +
          this.location.addressComponents[6].longName;
        break;
      case 8:
        this.formatedAddress =
          this.location.addressComponents[0].longName +
          ', ' +
          this.location.addressComponents[1].longName +
          ', ' +
          this.location.addressComponents[2].longName +
          ', ' +
          this.location.addressComponents[3].longName +
          ', ' +
          this.location.addressComponents[6].longName;
        break;
      case 7:
        this.formatedAddress =
          this.location.addressComponents[0].longName +
          ', ' +
          this.location.addressComponents[1].longName +
          ', ' +
          this.location.addressComponents[2].longName +
          ', ' +
          this.location.addressComponents[5].longName;
        break;
      case 6:
        this.formatedAddress =
          this.location.addressComponents[0].longName +
          ', ' +
          this.location.addressComponents[1].longName +
          ', ' +
          this.location.addressComponents[2].longName +
          ', ' +
          this.location.addressComponents[4].longName;
        break;
      case 5:
        this.formatedAddress =
          this.location.addressComponents[0].longName +
          ', ' +
          this.location.addressComponents[1].longName +
          ', ' +
          this.location.addressComponents[2].longName +
          ', ' +
          this.getCountry();
        break;
      case 4:
        this.formatedAddress =
          this.location.addressComponents[0].longName +
          ', ' +
          this.location.addressComponents[1].longName +
          ', ' +
          this.location.addressComponents[3].longName;
        break;
      case 3:
        this.formatedAddress =
          this.location.addressComponents[0].longName +
          ', ' +
          this.location.addressComponents[1].longName +
          ', ' +
          this.location.addressComponents[2].longName;
        break;
      case 2:
        this.formatedAddress =
          this.location.addressComponents[0].longName +
          ', ' +
          this.location.addressComponents[1].longName;
        break;
      case 1:
        this.formatedAddress =
          this.location.addressComponents[0].longName +
          ', ' +
          this.location.addressComponents[1].longName;
        break;
    }
  }
  getCountry(): string {
    return this.location.addressComponents[3].types.includes('country')
      ? this.location.addressComponents[3].longName
      : this.location.addressComponents[4].longName;
  }
}
