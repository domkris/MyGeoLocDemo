import { GeometryPlace } from './Geometry/geometry-place-interface';
import { OpeningHours } from './OpeningHours/openinghours-interface';
import { Photo } from './Photo/photo-interface';

export interface Place {
  bussinesStatus: string;
  geometry: GeometryPlace;
  icon: string;
  name: string;
  openingHours: OpeningHours;
  photos: Photo[];
  typles: string[];
  vicinity: string;
}
