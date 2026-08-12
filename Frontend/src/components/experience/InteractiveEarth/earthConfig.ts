/**
 * earthConfig.ts
 * Centralized configuration for the Interactive 3D Earth section.
 * All hotel-specific data lives here — do NOT hardcode elsewhere.
 */

export interface HotelGlobeConfig {
  /** Display name of the hotel/brand */
  name: string;
  /** City name */
  city: string;
  /** Country name */
  country: string;
  /** State/region */
  state: string;
  /** Verified geographic latitude (decimal degrees) */
  latitude: number;
  /** Verified geographic longitude (decimal degrees) */
  longitude: number;
  /** Full Google Maps URL — opens the hotel location */
  googleMapsUrl: string;
  /** Short tagline shown below the city label */
  tagline: string;
}

/**
 * NAMO Hotel & Travel — The Kushal Bagh Palace, Savina, Udaipur
 *
 * Coordinates sourced from the existing mapEmbedUrl in hotels.ts:
 *   lat=24.5539  lng=73.7051
 * These correspond to Savina, Udaipur, Rajasthan 313002.
 * Verify against physical address before production:
 *   02, Surya Nagar, The Kushal Bagh Palace, Savina, Udaipur, Rajasthan 313002
 */
export const NAMO_HOTEL_CONFIG: HotelGlobeConfig = {
  name: 'NAMO Hotel & Travel',
  city: 'Udaipur',
  state: 'Rajasthan',
  country: 'India',
  latitude: 24.5539,
  longitude: 73.7051,
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=24.5539,73.7051',
  tagline: 'Your journey begins here.',
};

/** Sphere radius used for the Earth mesh (Three.js units) */
export const EARTH_RADIUS = 1.0;

/**
 * Convert geographic latitude/longitude to a 3D position on the sphere.
 *
 * Three.js uses Y-up. The standard spherical conversion:
 *   phi   = (90 - lat)  * (PI / 180)   — polar angle from Y axis
 *   theta = (lng + 180) * (PI / 180)   — azimuthal (the +180 aligns
 *                                         the prime meridian to the texture center)
 *
 * x = r * sin(phi) * cos(theta)
 * y = r * cos(phi)
 * z = r * sin(phi) * sin(theta)
 */
export function latLngToVector3(
  lat: number,
  lng: number,
  radius: number = EARTH_RADIUS,
): { x: number; y: number; z: number } {
  const phi   = (90 - lat)   * (Math.PI / 180);
  const theta = (lng + 180)  * (Math.PI / 180);
  return {
    x:  radius * Math.sin(phi) * Math.cos(theta),
    y:  radius * Math.cos(phi),
    z:  radius * Math.sin(phi) * Math.sin(theta),
  };
}
