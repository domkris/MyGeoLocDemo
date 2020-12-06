import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChange,
} from '@angular/core';
import { items } from 'src/app/types/types-constants';
import { AddressInterface } from '../types/Address/address-interface';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  items = items;
  radius: number;
  radiusDefault: number = 1000;
  category: string;
  categoryDefaultId: number;
  locationFormatedToAddress: string;

  @Input() location: AddressInterface;
  @Output() searchPlacesEvent = new EventEmitter();
  constructor() {}

  ngOnInit(): void {
    this.categoryDefaultId = items.find((item) => item.name == 'restaurant').id;
    this.category = items.find(
      (item) => item.id == this.categoryDefaultId
    ).name;
    this.radius = this.radiusDefault;
  }
  ngOnChanges(changes: SimpleChange) {
    if (changes['location'].currentValue) {
      this.location = changes['location'].currentValue;
      this.formatAddress();
    }
  }

  onKeyAddress($event) {
    this.locationFormatedToAddress = $event.target.value;
  }
  onValueSelected(id: number) {
    this.category = items.find((item) => item.id == id).name;
  }

  onKeyRadius($event) {
    this.radius = $event.target.value;
  }
  formatAddress() {
    let addressComponentsLength: number = this.location.addressComponents
      .length;
    switch (addressComponentsLength) {
      case 9:
        this.locationFormatedToAddress =
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
        this.locationFormatedToAddress =
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
        this.locationFormatedToAddress =
          this.location.addressComponents[0].longName +
          ', ' +
          this.location.addressComponents[1].longName +
          ', ' +
          this.location.addressComponents[2].longName +
          ', ' +
          this.location.addressComponents[5].longName;
        break;
      case 6:
        this.locationFormatedToAddress =
          this.location.addressComponents[0].longName +
          ', ' +
          this.location.addressComponents[1].longName +
          ', ' +
          this.location.addressComponents[2].longName +
          ', ' +
          this.location.addressComponents[4].longName;
        break;
      case 5:
        this.locationFormatedToAddress =
          this.location.addressComponents[0].longName +
          ', ' +
          this.location.addressComponents[1].longName +
          ', ' +
          this.location.addressComponents[2].longName +
          ', ' +
          this.getCountry();
        break;
      case 4:
        this.locationFormatedToAddress =
          this.location.addressComponents[0].longName +
          ', ' +
          this.location.addressComponents[1].longName +
          ', ' +
          this.location.addressComponents[3].longName;
        break;
      case 3:
        this.locationFormatedToAddress =
          this.location.addressComponents[0].longName +
          ', ' +
          this.location.addressComponents[1].longName +
          ', ' +
          this.location.addressComponents[2].longName;
        break;
      case 2:
        this.locationFormatedToAddress =
          this.location.addressComponents[0].longName +
          ', ' +
          this.location.addressComponents[1].longName;
        break;
      case 1:
        this.locationFormatedToAddress =
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