import { LocationInterface } from '../Location/location-interface';
import { ViewportInterface } from '../Viewport/viewport-interface';

export interface GeometryAddressInterface {
  location: LocationInterface;
  locationType: string;
  viewport: ViewportInterface;
}
