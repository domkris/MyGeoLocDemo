import { Loader } from '@googlemaps/js-api-loader';
import { apiKey } from 'src/app/constants/constants';
export const loader = new Loader({
  apiKey: apiKey,
  version: 'weekly',
});
