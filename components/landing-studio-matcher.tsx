'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchPublicStudioProfiles } from '@/lib/studio-client';
import { calculateDistance } from '@/lib/coordinates';
import type { StudioProfile } from '@/lib/types';
import { MapPin, Loader2 } from 'lucide-react';

interface NearestStudio {
  studio: StudioProfile;
  distance: number;
}

interface LandingStudioMatcherProps {
  className?: string;
}

export function LandingStudioMatcher({ className = "" }: LandingStudioMatcherProps) {
  const [studios, setStudios] = useState<StudioProfile[]>([]);
  const [nearestStudio, setNearestStudio] = useState<NearestStudio | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [allStudioDistances, setAllStudioDistances] = useState<Array<{studio: StudioProfile, distance: number}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const formatDistance = (distance: number): string => {
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }
  };

  const findNearestStudioWithLocation = useCallback(async (userLocation: { latitude: number; longitude: number }) => {
    if (studios.length === 0) {
      console.log('No studios available yet');
      return;
    }

    console.log('Finding nearest studio with location:', userLocation);
    console.log('Available studios:', studios);

    // Calculate distance to each studio and find the nearest one
    let nearest: NearestStudio | null = null;
    let minDistance = Infinity;
    const allDistances: Array<{studio: StudioProfile, distance: number}> = [];

    studios.forEach((studio) => {
      if (studio.latitude && studio.longitude) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          studio.latitude,
          studio.longitude
        );
        
        // Store all distances for debug display
        allDistances.push({
          studio: studio,
          distance: distance
        });
        
        if (distance < minDistance) {
          minDistance = distance;
          nearest = {
            studio: studio,
            distance: distance
          };
        }
      }
    });

    // Sort by distance for debug display
    allDistances.sort((a, b) => a.distance - b.distance);
    setAllStudioDistances(allDistances);

    console.log('Found nearest studio:', nearest);
    setNearestStudio(nearest);
  }, [studios]);

  const requestLocationImmediately = useCallback(async () => {
    if (!navigator.geolocation) {
      console.log('Geolocation not supported');
      return;
    }

    console.log('Automatically requesting location for testing...');
    setIsDetecting(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setUserLocation(location);
      console.log('User location obtained:', location);
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setIsDetecting(false);
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
    loadStudios();
  }, []);

  // Automatically request location once when studios are loaded
  useEffect(() => {
    if (isClient && !isLoading && studios.length > 0 && !userLocation && !isDetecting) {
      console.log('Auto-requesting location after studios loaded...');
      requestLocationImmediately();
    }
  }, [isClient, isLoading, studios.length, userLocation, isDetecting, requestLocationImmediately]);

  const loadStudios = async () => {
    try {
      setIsLoading(true);
      console.log('Starting to load studios...');
      const studioData = await fetchPublicStudioProfiles();
      console.log('Loaded studios:', studioData);
      console.log('Number of studios loaded:', studioData.length);
      if (studioData.length > 0) {
        console.log('First studio example:', studioData[0]);
        console.log('First studio has coordinates:', studioData[0].latitude, studioData[0].longitude);
      } else {
        console.log('No studios found in database - this might be due to RLS policies blocking access');
      }
      setStudios(studioData);
    } catch (error) {
      console.error('Failed to load studios:', error);
      console.error('Error details:', error);
    } finally {
      setIsLoading(false);
    }
  };



  // Find nearest studio when studios are loaded and we have user location
  useEffect(() => {
    if (userLocation && studios.length > 0 && !nearestStudio) {
      console.log('Studios loaded, finding nearest studio with existing location...');
      findNearestStudioWithLocation(userLocation);
    }
  }, [userLocation, studios.length, nearestStudio, findNearestStudioWithLocation]);

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className={`flex items-left gap-2 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  // Show loading state while fetching studios
  if (isLoading) {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <div className="flex items-left gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <span className="text-lg font-semibold">Loading Studios...</span>
        </div>
        {userLocation && (
          <div className="text-xs text-muted-foreground ml-6">
            Lat: {userLocation.latitude.toFixed(6)}, Lon: {userLocation.longitude.toFixed(6)}
          </div>
        )}
      </div>
    );
  }

  // Show detecting state
  if (isDetecting) {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <div className="flex items-left gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <span className="text-lg font-semibold">Finding Nearby Studio...</span>
        </div>
        {userLocation && (
          <div className="text-xs text-muted-foreground ml-6">
            Lat: {userLocation.latitude.toFixed(6)}, Lon: {userLocation.longitude.toFixed(6)}
          </div>
        )}
      </div>
    );
  }

  // Show nearest studio
  if (nearestStudio) {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <div className="flex items-left gap-2">
          <span className="text-lg font-semibold">
            {nearestStudio.studio.studio_name}
          </span>
        </div>
        {/* <div className="text-xs text-muted-foreground ml-6 space-y-1">
          <div>Distance: {formatDistance(nearestStudio.distance)}</div>
          {userLocation && (
            <div>Lat: {userLocation.latitude.toFixed(6)}, Lon: {userLocation.longitude.toFixed(6)}</div>
          )}
        </div> */}
      </div>
    );
  }

  // Show default title when no studio is found or location not available
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-left gap-2">
        <MapPin className="h-4 w-4 text-blue-600" />
        <span className="text-lg font-semibold">Design Studio Attendance</span>
      </div>
      {userLocation && (
        <div className="text-xs text-muted-foreground ml-6">
          Lat: {userLocation.latitude.toFixed(6)}, Lon: {userLocation.longitude.toFixed(6)}
        </div>
      )}
      {/* Debug info */}
      <div className="text-xs text-red-500 ml-6 space-y-1">
        <div>Debug: Studios: {studios.length}, Nearest: {nearestStudio ? 'Found' : 'None'}, Loading: {isLoading ? 'Yes' : 'No'}, Detecting: {isDetecting ? 'Yes' : 'No'}</div>
        {allStudioDistances.length > 0 && (
          <div>
            <div className="font-semibold">All Studio Distances:</div>
            {allStudioDistances.map((item, index) => (
              <div key={index} className="ml-2">
                {item.studio.studio_name}: {formatDistance(item.distance)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
