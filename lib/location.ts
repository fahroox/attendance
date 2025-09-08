/**
 * Location utilities for detecting user location and matching with studio locations
 */

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface LocationMatch {
  studio: {
    id?: string;
    studio_name: string;
    studio_tagline: string | null;
    google_maps_url: string | null;
    longitude: number | null;
    latitude: number | null;
    created_at?: string;
    updated_at?: string;
  };
  distance: number; // in meters
}

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param lat1 - First latitude
 * @param lon1 - First longitude
 * @param lat2 - Second latitude
 * @param lon2 - Second longitude
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
}

/**
 * Find studios within a specified radius from user location
 * @param userLocation - User's current location
 * @param studios - Array of studio profiles
 * @param maxDistance - Maximum distance in meters (default: 500)
 * @returns Array of matching studios with distances
 */
export function findNearbyStudios(
  userLocation: UserLocation,
  studios: Array<{
    id?: string;
    studio_name: string;
    studio_tagline: string | null;
    google_maps_url: string | null;
    longitude: number | null;
    latitude: number | null;
    created_at?: string;
    updated_at?: string;
  }>,
  maxDistance: number = 500
): LocationMatch[] {
  const matches: LocationMatch[] = [];

  for (const studio of studios) {
    // Skip studios without valid coordinates
    if (
      studio.latitude === null ||
      studio.longitude === null ||
      studio.latitude === undefined ||
      studio.longitude === undefined
    ) {
      continue;
    }

    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      studio.latitude,
      studio.longitude
    );

    if (distance <= maxDistance) {
      matches.push({
        studio,
        distance: Math.round(distance),
      });
    }
  }

  // Sort by distance (closest first)
  return matches.sort((a, b) => a.distance - b.distance);
}

/**
 * Get user's current location using browser geolocation API
 * @returns Promise that resolves to user location or rejects with error
 */
export function getUserLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
}

/**
 * Format distance for display
 * @param distance - Distance in meters
 * @returns Formatted distance string
 */
export function formatDistance(distance: number): string {
  if (distance < 1000) {
    return `${distance}m`;
  } else {
    return `${(distance / 1000).toFixed(1)}km`;
  }
}
