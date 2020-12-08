import { AddressComponents } from '../Address/address-components-interface';
import { GeometryAddress } from '../Address/geometry-address-interface';
import { PlusCode } from '../Address/plus-code-interface';

export interface GeoLocation {
  addressComponents: AddressComponents[];
  formatedAddress: string;
  geometry: GeometryAddress;
  placeId: string;
  plusCode: PlusCode;
  typles: string[];
}
