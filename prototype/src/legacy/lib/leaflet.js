import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerIcon2xUrl from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';

/**
 * Leaflet's stock pin. The published site loaded these from unpkg; here they
 * come from the local `leaflet` package so maps work offline.
 */
// Next.js imports images as { src, width, height } rather than a URL string.
const url = (image) => (typeof image === 'string' ? image : image.src);

export const defaultMarkerIcon = L.icon({
  iconUrl: url(markerIconUrl),
  iconRetinaUrl: url(markerIcon2xUrl),
  shadowUrl: url(markerShadowUrl),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export const markerIcon = defaultMarkerIcon;
