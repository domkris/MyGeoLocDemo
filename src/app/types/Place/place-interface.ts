import { GeometryPlaceInterface } from './Geometry/geometry-place-interface';
import { OpeningHoursInterface } from './OpeningHours/openinghours-interface';
import { PhotoInterface } from './Photo/photo-interface';

export interface PlaceInterface {
  bussinesStatus: string;
  geometry: GeometryPlaceInterface;
  icon: string;
  name: string;
  openingHours: OpeningHoursInterface;
  photos: PhotoInterface[];
  typles: string[];
  vicinity: string;
}
