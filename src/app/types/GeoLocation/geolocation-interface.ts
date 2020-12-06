import { AddressComponentsInterface } from '../Address/address-components-interface';
import { GeometryAddressInterface } from '../Address/geometry-address-interface';
import { PlusCodeInterface } from '../Address/plus-code-interface';

export interface GeoLocationInterface {
  addressComponents: AddressComponentsInterface[];
  formatedAddress: string;
  geometry: GeometryAddressInterface;
  placeId: string;
  plusCode: PlusCodeInterface;
  typles: string[];
}
