/**
 * Tests for location utilities
 */

import { calculateDistance, findNearbyStudios } from '../location';

describe('Location Utilities', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two points correctly', () => {
      // Test with known coordinates (New York to Los Angeles)
      const nyLat = 40.7128;
      const nyLon = -74.0060;
      const laLat = 34.0522;
      const laLon = -118.2437;
      
      const distance = calculateDistance(nyLat, nyLon, laLat, laLon);
      
      // Distance should be approximately 3944 km (3944000 meters)
      expect(distance).toBeCloseTo(3944000, -3); // Within 1km tolerance
    });

    it('should calculate distance between same points as 0', () => {
      const lat = 40.7128;
      const lon = -74.0060;
      
      const distance = calculateDistance(lat, lon, lat, lon);
      
      expect(distance).toBe(0);
    });

    it('should calculate short distances accurately', () => {
      // Test with coordinates 100m apart
      const lat1 = 40.7128;
      const lon1 = -74.0060;
      const lat2 = 40.7138; // ~100m north
      const lon2 = -74.0060;
      
      const distance = calculateDistance(lat1, lon1, lat2, lon2);
      
      expect(distance).toBeCloseTo(100, 10); // Within 10m tolerance
    });
  });

  describe('findNearbyStudios', () => {
    const mockStudios = [
      {
        id: '1',
        studio_name: 'Studio A',
        studio_tagline: 'Near studio',
        longitude: -74.0060,
        latitude: 40.7128,
      },
      {
        id: '2',
        studio_name: 'Studio B',
        studio_tagline: 'Far studio',
        longitude: -74.0160, // ~1km away
        latitude: 40.7128,
      },
      {
        id: '3',
        studio_name: 'Studio C',
        studio_tagline: 'No coordinates',
        longitude: null,
        latitude: null,
      },
    ];

    it('should find studios within 500m radius', () => {
      const userLocation = {
        latitude: 40.7128,
        longitude: -74.0060,
      };

      const matches = findNearbyStudios(userLocation, mockStudios, 500);

      expect(matches).toHaveLength(1);
      expect(matches[0].studio.studio_name).toBe('Studio A');
      expect(matches[0].distance).toBe(0);
    });

    it('should find studios within 1000m radius', () => {
      const userLocation = {
        latitude: 40.7128,
        longitude: -74.0060,
      };

      const matches = findNearbyStudios(userLocation, mockStudios, 1000);

      expect(matches).toHaveLength(2);
      expect(matches[0].studio.studio_name).toBe('Studio A');
      expect(matches[1].studio.studio_name).toBe('Studio B');
    });

    it('should exclude studios without coordinates', () => {
      const userLocation = {
        latitude: 40.7128,
        longitude: -74.0060,
      };

      const matches = findNearbyStudios(userLocation, mockStudios, 1000);

      expect(matches.every(match => match.studio.longitude !== null)).toBe(true);
      expect(matches.every(match => match.studio.latitude !== null)).toBe(true);
    });

    it('should return empty array when no studios are nearby', () => {
      const userLocation = {
        latitude: 0,
        longitude: 0,
      };

      const matches = findNearbyStudios(userLocation, mockStudios, 100);

      expect(matches).toHaveLength(0);
    });
  });
});
