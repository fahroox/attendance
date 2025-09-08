/**
 * Utility functions for extracting coordinates from Google Maps URLs
 */

export interface Coordinates {
  latitude: number | null;
  longitude: number | null;
}

/**
 * Extracts latitude and longitude from various Google Maps URL formats
 * @param url - Google Maps URL
 * @returns Object with latitude and longitude, or null values if extraction fails
 */
export function extractCoordinatesFromGoogleMapsUrl(url: string): Coordinates {
  if (!url || typeof url !== 'string') {
    return { latitude: null, longitude: null };
  }

  try {
    // Clean the URL
    const cleanUrl = url.trim();
    
    // Pattern 1: Google Maps place URL with coordinates in the path (PRIORITY)
    // Format: https://www.google.com/maps/place/Place+Name/@lat,lng,zoom/data=...
    // Example: https://www.google.com/maps/place/Mahative+Studio/@-8.0019522,112.6069239,19z/data=...
    // This is the user-selected coordinates in the URL
    const placePattern = /\/place\/[^/]+\/@(-?\d+\.?\d*),(-?\d+\.?\d*),\d+z/;
    const placeMatch = cleanUrl.match(placePattern);
    if (placeMatch) {
      return {
        latitude: parseFloat(placeMatch[1]),
        longitude: parseFloat(placeMatch[2])
      };
    }

    // Pattern 2: @lat,lng,zoom format (fallback for non-place URLs)
    // Format: https://maps.google.com/maps?q=@40.7128,-74.0060,15z
    const atPattern = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const atMatch = cleanUrl.match(atPattern);
    if (atMatch) {
      return {
        latitude: parseFloat(atMatch[1]),
        longitude: parseFloat(atMatch[2])
      };
    }

    // Pattern 3: Google Maps place URL with coordinates in data parameters (fallback)
    // Format: ...data=!4m6!3m5!1s0x...!8m2!3dlat!4dlng!16s...
    // This is used as fallback when @ coordinates are not available
    const dataPattern = /!8m2!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)!/;
    const dataMatch = cleanUrl.match(dataPattern);
    if (dataMatch) {
      return {
        latitude: parseFloat(dataMatch[1]),
        longitude: parseFloat(dataMatch[2])
      };
    }

    // Pattern 4: ll=lat,lng format (e.g., https://maps.google.com/maps?ll=40.7128,-74.0060)
    const llPattern = /[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const llMatch = cleanUrl.match(llPattern);
    if (llMatch) {
      return {
        latitude: parseFloat(llMatch[1]),
        longitude: parseFloat(llMatch[2])
      };
    }

    // Pattern 5: center=lat,lng format (e.g., https://maps.google.com/maps?center=40.7128,-74.0060)
    const centerPattern = /[?&]center=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const centerMatch = cleanUrl.match(centerPattern);
    if (centerMatch) {
      return {
        latitude: parseFloat(centerMatch[1]),
        longitude: parseFloat(centerMatch[2])
      };
    }

    // Pattern 6: q=lat,lng format (e.g., https://maps.google.com/maps?q=40.7128,-74.0060)
    const qPattern = /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)(?:[^&]|$)/;
    const qMatch = cleanUrl.match(qPattern);
    if (qMatch) {
      return {
        latitude: parseFloat(qMatch[1]),
        longitude: parseFloat(qMatch[2])
      };
    }

    // Pattern 7: Place ID format - we can't extract coordinates from this without API call
    // For now, return null values
    if (cleanUrl.includes('place_id=') || cleanUrl.includes('place/')) {
      return { latitude: null, longitude: null };
    }

    // If no pattern matches, return null values
    return { latitude: null, longitude: null };

  } catch (error) {
    console.error('Error extracting coordinates from Google Maps URL:', error);
    return { latitude: null, longitude: null };
  }
}

/**
 * Validates if the extracted coordinates are within valid ranges
 * @param coordinates - Object with latitude and longitude
 * @returns boolean indicating if coordinates are valid
 */
export function validateCoordinates(coordinates: Coordinates): boolean {
  const { latitude, longitude } = coordinates;
  
  if (latitude === null || longitude === null) {
    return false;
  }

  // Check if latitude is between -90 and 90
  if (latitude < -90 || latitude > 90) {
    return false;
  }

  // Check if longitude is between -180 and 180
  if (longitude < -180 || longitude > 180) {
    return false;
  }

  return true;
}

/**
 * Formats coordinates for display
 * @param coordinates - Object with latitude and longitude
 * @returns Formatted string or null if coordinates are invalid
 */
export function formatCoordinates(coordinates: Coordinates): string | null {
  if (!validateCoordinates(coordinates)) {
    return null;
  }

  const { latitude, longitude } = coordinates;
  return `${latitude!.toFixed(6)}, ${longitude!.toFixed(6)}`;
}

/**
 * Creates a Google Maps URL from coordinates
 * @param latitude - Latitude value
 * @param longitude - Longitude value
 * @param zoom - Zoom level (optional, default: 15)
 * @returns Google Maps URL
 */
export function createGoogleMapsUrl(latitude: number, longitude: number, zoom: number = 15): string {
  return `https://maps.google.com/maps?q=${latitude},${longitude}&z=${zoom}`;
}

/**
 * Calculates the distance between two coordinates using the Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in meters
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}
