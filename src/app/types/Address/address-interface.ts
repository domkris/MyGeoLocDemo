import { AddressComponentsInterface } from './address-components-interface';
import { GeometryAddressInterface } from './geometry-address-interface';
import { PlusCodeInterface } from './plus-code-interface';

export interface AddressInterface {
  addressComponents: AddressComponentsInterface[];
  formatedAddress: string;
  geometry: GeometryAddressInterface;
  placeId: string;
  plusCode: PlusCodeInterface;
  typles: string[];
}
