import { vesselBreakShotImage } from './vesselBreakShotImage.js';
import { vesselExteriorImage } from './vesselExteriorImage.js';
import { vesselInteriorImage } from './vesselInteriorImage.js';

export const SAMPLE_ARTIFACTS = [{
  id: "art-001",
  name: "La Quemada V-112",
  type: "Storage Vessel",
  period: "700-900 CE",
  location: "La Quemada, Zacatecas, Mexico",
  lat: 22.4711,
  lng: -102.8258,
  tradition: "Epiclassic Mesoamerican",
  privacy: "Public",
  images: {
    exterior: vesselExteriorImage,
    interior: vesselInteriorImage,
    breakShot: vesselBreakShotImage
  }
}, {
  id: "art-002",
  name: "La Quemada V-113",
  type: "Cooking Vessel",
  period: "700-900 CE",
  location: "La Quemada, Zacatecas, Mexico",
  lat: 22.4711,
  lng: -102.8258,
  tradition: "Epiclassic Mesoamerican",
  privacy: "Public",
  images: {
    exterior: vesselInteriorImage,
    interior: vesselExteriorImage,
    breakShot: vesselBreakShotImage
  }
}, {
  id: "art-003",
  name: "La Quemada V-114",
  type: "Serving Vessel",
  period: "700-900 CE",
  location: "La Quemada, Zacatecas, Mexico",
  lat: 22.4711,
  lng: -102.8258,
  tradition: "Epiclassic Mesoamerican",
  privacy: "Public",
  images: {
    exterior: vesselBreakShotImage,
    interior: vesselExteriorImage
  }
}];
