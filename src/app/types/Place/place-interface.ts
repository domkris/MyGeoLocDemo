import { GeometryInterface } from './Geometry/geometry-interface';
import { OpeningHoursInterface } from './OpeningHours/openinghours-interface';
import { PhotoInterface } from './Photo/photo-interface';

export interface PlaceInterface {
  bussinesStatus: string;
  geometry: GeometryInterface;
  icon: string;
  name: string;
  openingHours: OpeningHoursInterface;
  photos: PhotoInterface[];
  typles: string[];
  vicinity: string;
}
