/**
 * Geolocation and Haversine distance utilities
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Calculates the great-circle distance between two points on Earth using the Haversine formula.
 * Result in kilometers.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Human-readable distance formatting in Italian style
 */
export function formatDistance(distanceKm: number | undefined | null): string {
  if (distanceKm == null || isNaN(distanceKm)) return '';
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `a ${meters} m`;
  }
  return `a ${distanceKm.toFixed(1)} km`;
}

/**
 * Request real browser location
 */
export function requestCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalizzazione non supportata dal tuo browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        let msg = 'Impossibile rilevare la posizione.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Permesso di localizzazione negato dall\'utente.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Informazioni sulla posizione non disponibili.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Richiesta di geolocalizzazione scaduta.';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}

/**
 * Generates an official Google Maps navigation link
 */
export function getGoogleMapsNavigationUrl(lat: number, lng: number, label?: string): string {
  const query = encodeURIComponent(`${lat},${lng}${label ? ` (${label})` : ''}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
