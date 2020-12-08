import { Location } from '../Location/location-interface';
import { Viewport } from '../Viewport/viewport-interface';

export interface GeometryAddress {
  location: Location;
  locationType: string;
  viewport: Viewport;
}
